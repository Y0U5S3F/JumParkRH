from django.shortcuts import render, get_object_or_404
from rest_framework import generics, status
from .models import Salaire
from django.utils.translation import gettext as _
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
    

months_french = [
    _('January'), _('February'), _('March'), _('April'),
    _('May'), _('June'), _('July'), _('August'),
    _('September'), _('October'), _('November'), _('December')
]

    
    
def generetfichedepaie(request, id):
    # Récupérer l'objet Salaire correspondant à l'ID
    salaire = get_object_or_404(Salaire, id=id)

    # Construire le contexte pour le template
    months_french = [
        _('Janvier'), _('Février'), _('Mars'), _('Avril'),
        _('Mai'), _('Juin'), _('Juillet'), _('Août'),
        _('Septembre'), _('Octobre'), _('Novembre'), _('Décembre')
    ]
    current_month = datetime.now().month
    month_french = months_french[current_month - 1]  # Adjust for 0-based index

    context = {
        "nom": salaire.employe.nom + " " + salaire.employe.prenom,
        "situationFamiliale": getattr(salaire.employe, "situation_familiale", ""),
        "cnss": salaire.employe.CNSS,
        "matricule": salaire.employe.matricule,
        "createdAt": salaire.employe.created_at.strftime("%d/%m/%Y") if salaire.employe.created_at else "",
        "salaireContrat": salaire.employe.salaire_base,
        "serviceNom": str(salaire.employe.service.nom),
        "departementNom": str(salaire.employe.departement.nom),
        "ribBancaire": salaire.employe.rib_bancaire,
        "jourTotal": salaire.jour_heure_travaille,
        "jourFerie": salaire.jour_ferie,
        "jourConge": salaire.conge_paye,
        "jourAbcense": 0,  # Valeur par défaut
        "soldeConge": salaire.prix_tot_conge,
        "nbJourBase": salaire.jour_heure_travaille,
        "salaireBase": salaire.employe.salaire_base,
        "nbJourTotal": salaire.jour_heure_travaille,
        "primePresence": salaire.prime_presence,
        "primeTransport": salaire.prime_transport,
        "salaireBrut": salaire.salaire_brut,
        "retenueCNSS": salaire.cnss,
        "salaireImposable": salaire.salaire_imposable,
        "appointPlus": salaire.prix_tot_sup,
        "acompte": salaire.acompte,
        "impoRev": salaire.impots,
        "appointMoins": salaire.apoint,
        "CSS": salaire.css,
        "salaireNet": salaire.salaire_net,
        "modePaiment": salaire.mode_paiement,
        # Mois et année dynamiques
        "mois": month_french,  # Use French month
        "annee": datetime.now().strftime("%Y")
    }

    # Charger et rendre le template LaTeX
    template = get_template("fichedepaie.tex")
    rendered_tex = template.render(context)

    # Création d'un fichier temporaire pour stocker le LaTeX et générer le PDF
    with tempfile.TemporaryDirectory() as tmpdirname:
        tex_file_path = os.path.join(tmpdirname, "fichedepaie.tex")
        pdf_file_path = os.path.join(tmpdirname, "fichedepaie.pdf")

        with open(tex_file_path, "w", encoding="utf-8") as tex_file:
            tex_file.write(rendered_tex)

        # Compilation en PDF avec pdflatex
        subprocess.run(["pdflatex", "-interaction=nonstopmode", tex_file_path], cwd=tmpdirname, check=True)

        with open(pdf_file_path, "rb") as pdf_file:
            pdf_data = pdf_file.read()

    # Construire le nom du fichier (avec des underscores pour éviter les problèmes d'espaces)
    employe_nom = re.sub(r'\s+', '_', salaire.employe.nom + " " + salaire.employe.prenom)
    mois = context["mois"]
    filename = f"{employe_nom}_{mois}_fichedepaie.pdf"

    response = HttpResponse(pdf_data, content_type="application/pdf")
    response["Content-Disposition"] = f'attachment; filename="{filename}"'
    return response