from django.shortcuts import render, get_object_or_404
from rest_framework import generics
from .models import Salaire
from .serializers import SalaireSerializer

from django.http import HttpResponse, Http404
from django.template.loader import get_template

import re
import os
import subprocess
import tempfile

# DRF views for Salaire API
class SalaireListCreateView(generics.ListCreateAPIView):
    queryset = Salaire.objects.all()
    serializer_class = SalaireSerializer

class SalaireRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Salaire.objects.all()
    serializer_class = SalaireSerializer

def generetfichedepaie(request):
    # Retrieve the salary ID from the GET parameter
    salary_id = request.GET.get('id')
    if not salary_id:
        raise Http404("No salary id provided.")

    # Get the Salaire object (or 404 if not found)
    salaire = get_object_or_404(Salaire, id=salary_id)

    # Build the context dictionary.
    # Note: Adjust field names as needed. For instance, we now use `rib_bancaire` from Employe.
    context = {
        "nom": salaire.employe.nom,
        "situationFamiliale": getattr(salaire.employe, "situation_familiale", ""),
        "cnss": salaire.employe.CNSS,
        "matricule": salaire.employe.matricule,  # since matricule is the primary key in Employe
        "createdAt": salaire.employe.created_at.strftime("%d/%m/%Y") if salaire.employe.created_at else "",
        "salaireContrat": salaire.employe.salaire_base,  # Using the field from Salaire model
        "serviceNom": str(salaire.employe.service.nom),  # Assuming Service model has a useful __str__
        "departementNom": str(salaire.employe.departement.nom),  # Likewise for Departement
        "ribBancaire": salaire.employe.rib_bancaire,
        # For demonstration, we use jour_heure_travaille for both nbJourBase and nbJourTotal.
        "jourTotal": salaire.jour_heure_travaille,
        "jourFerie": salaire.jour_ferie,
        "jourConge": salaire.conge_paye,
        "jourAbcense": 0,  # If not stored, default to 0
        "soldeConge": salaire.prix_tot_conge, 
        "nbJourBase": salaire.jour_heure_travaille,
        "salaireBase": salaire.employe.salaire_base,
        "nbJourTotal": salaire.jour_heure_travaille,
        "primePresence": salaire.prime_presence,
        "primeTransport": salaire.prime_transport,
        "salaireBrut": salaire.salaire_brut,
        "retenueCNSS": salaire.cnss,
        "salaireImposable": salaire.salaire_imposable,
        "appointPlus": salaire.prix_tot_sup,  # Using the field from the model
        "acompte": salaire.acompte,
        "impoRev": salaire.impots,
        "appointMoins": salaire.apoint,
        "CSS": salaire.css,
        "salaireNet": salaire.salaire_net,
        "modePaiment": salaire.mode_paiement,
        # Static or derived month/year information
        "mois": "Mars",
        "annee": "2025"
    }

    # Render the LaTeX template with context
    template = get_template("payslip_template.tex")
    rendered_tex = template.render(context)

    # Create a temporary directory and write the rendered LaTeX code to a .tex file
    with tempfile.TemporaryDirectory() as tmpdirname:
        tex_file_path = os.path.join(tmpdirname, "payslip.tex")
        pdf_file_path = os.path.join(tmpdirname, "payslip.pdf")

        with open(tex_file_path, "w", encoding="utf-8") as tex_file:
            tex_file.write(rendered_tex)

        # Compile the LaTeX file into a PDF using pdflatex.
        subprocess.run(
            ["pdflatex", "-interaction=nonstopmode", tex_file_path],
            cwd=tmpdirname,
            check=True
        )

        # Read the generated PDF file
        with open(pdf_file_path, "rb") as pdf_file:
            pdf_data = pdf_file.read()

    # Build the filename using the employee's name and the month.
    # Replace spaces with underscores for a safe filename.
    employee_name = re.sub(r'\s+', '_', salaire.employe.nom)
    month = context.get("mois", "month")
    filename = f"{employee_name}_{month}.pdf"
    
    response = HttpResponse(pdf_data, content_type="application/pdf")
    response["Content-Disposition"] = f'attachment; filename="{filename}"'
    return response
