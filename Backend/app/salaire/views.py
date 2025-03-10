from django.shortcuts import render, get_object_or_404
from rest_framework import generics, status
from .models import Salaire
from employe.models import Employe
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import SalaireSerializer
from label.models import Label, LabelData
from conge.models import Conge
from datetime import timedelta
from jourferie.models import JourFerie
from datetime import datetime
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

class SalaireBaseView(APIView):
    def get(self, request, matricule):
        # Get the employee by matricule
        employe = get_object_or_404(Employe, matricule=matricule)

        # Ensure that the employe has a salaire_base field
        salaire_base = employe.salaire_base  # Fetch salaire_base directly from Employe model

        # Get the Label linked to this employee
        label = Label.objects.filter(employe=employe).first()
        if not label:
            return Response({"error": "Label not found for this employee"}, status=status.HTTP_404_NOT_FOUND)

        # Get only the LabelData that belongs to this Label
        label_data_entries = LabelData.objects.filter(label=label)

        total_hours_worked = timedelta()  # Initialize total worked hours
        total_absences = 0  # Count total absence days

        for entry in label_data_entries:
            if entry.status == "absent":
                total_absences += 1  # Count each absence entry as a day absent

            # Calculate work duration
            worked_duration = (entry.endDate - entry.startDate) if (entry.startDate and entry.endDate) else timedelta()

            # Calculate pause duration
            pause_duration = (entry.endPause - entry.startPause) if (entry.startPause and entry.endPause) else timedelta()

            # Subtract pause duration from work duration
            total_hours_worked += (worked_duration - pause_duration)

        # Convert total worked time into decimal hours
        total_hours = total_hours_worked.total_seconds() / 3600  

        # Get current month
        current_month = datetime.now().month

        # Count the number of holidays (jour_ferie) for the current month
        jour_ferie_count = JourFerie.objects.filter(date__month=current_month).count()

        # Count the number of leaves (congés) for the employee in the current month
        conge_count = Conge.objects.filter(employe=employe, startDate__month=current_month).count()

        # Return the response including the salaire_base and other calculated values
        return Response({
            "salaire_base": salaire_base,  # Directly using salaire_base from the Employe model
            "jour_heure_travaille": round(total_hours, 2),  # Rounded to 2 decimal places
            "jour_ferie": jour_ferie_count,
            "nombre_conges": conge_count,  # Total leave days
            "jours_absence": total_absences  # Total absence days
        }, status=status.HTTP_200_OK)
    
    
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
