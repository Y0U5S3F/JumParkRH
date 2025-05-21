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
from django.http import StreamingHttpResponse
import json
import re
import os
import subprocess
import tempfile
from datetime import datetime

# DRF views for Salaire API
class SalaireListCreateView(generics.ListCreateAPIView):
    queryset = Salaire.objects.all().order_by('id').select_related('employe')
    serializer_class = SalaireSerializer

    def list(self, request, *args, **kwargs):
        """Handles both normal and streaming responses"""
        if request.query_params.get("stream") == "true":
            return self.stream_response()
        return super().list(request, *args, **kwargs)
    
    def stream_response(self):
        """Streams JSON data for large datasets"""
        queryset = self.filter_queryset(self.get_queryset())

        def data_stream():
            for salaire in queryset.iterator(chunk_size=100):
                salaire_data = {
                    "id": salaire.id,
                    "employe": salaire.employe.matricule,  # Assuming matricule is a unique identifier
                    "salaire_base": str(salaire.salaire_base),
                    "salaire_net": str(salaire.salaire_net),
                    "jour_heure_travaille": str(salaire.jour_heure_travaille),
                    "heures_sup": str(salaire.heures_sup),
                    "prix_tot_sup": str(salaire.prix_tot_sup),
                    "prime_transport": str(salaire.prime_transport),
                    "prime_presence": str(salaire.prime_presence),
                    "acompte": str(salaire.acompte),
                    "impots": str(salaire.impots),
                    "css": str(salaire.css),
                    "cnss": str(salaire.cnss),
                    "salaire_brut": str(salaire.salaire_brut),
                    "salaire_imposable": str(salaire.salaire_imposable),
                    "mode_paiement": salaire.mode_paiement,
                    "created_at": salaire.created_at.isoformat(),
                }
                yield f"{json.dumps(salaire_data)}\n"

        response = StreamingHttpResponse(data_stream(), content_type="application/json")
        response["Cache-Control"] = "no-cache"
        return response

    def perform_create(self, serializer):
        """Handles object creation"""
        serializer.save()

class SalaireRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Salaire.objects.all()
    serializer_class = SalaireSerializer

class SalaireBaseView(APIView):
    def get(self, request, matricule):
        employe = get_object_or_404(Employe, matricule=matricule)

        salaire_base = employe.salaire_base

        label = Label.objects.filter(employe=employe).first()
        if not label:
            return Response({"error": "Label not found for this employee"}, status=status.HTTP_404_NOT_FOUND)

        current_month = datetime.now().month
        current_year = datetime.now().year
        
        label_data_entries = LabelData.objects.filter(
            label=label,
            startDate__month=current_month,
            startDate__year=current_year
        ).order_by('startDate')

        total_hours_worked = timedelta()
        total_absences = 0

        for entry in label_data_entries:
            if entry.status == "absent":
                total_absences += 1

            worked_duration = (entry.endDate - entry.startDate) if (entry.startDate and entry.endDate) else timedelta()

            pause_duration = (entry.endPause - entry.startPause) if (entry.startPause and entry.endPause) else timedelta()

            total_hours_worked += (worked_duration - pause_duration)

        total_hours = total_hours_worked.total_seconds() / 3600  

        current_month = datetime.now().month

        jour_ferie_count = JourFerie.objects.filter(date__month=current_month).count()

        conge_count = Conge.objects.filter(employe=employe, startDate__month=current_month).count()

        return Response({
            "salaire_base": salaire_base,
            "jour_heure_travaille": round(total_hours, 2),
            "jour_ferie": jour_ferie_count,
            "nombre_conges": conge_count,
            "jours_absence": total_absences
        }, status=status.HTTP_200_OK)
    
    
    
def generetfichedepaie(request, id):
    salaire = get_object_or_404(Salaire, id=id)

    months_french = [
        _('Janvier'), _('Février'), _('Mars'), _('Avril'),
        _('Mai'), _('Juin'), _('Juillet'), _('Août'),
        _('Septembre'), _('Octobre'), _('Novembre'), _('Décembre')
    ]
    current_month = datetime.now().month
    month_french = months_french[current_month - 1]

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
        "jourAbcense": 0,
        "soldeConge": salaire.prix_tot_conge,
        "nbJourBase": salaire.jour_heure_travaille,
        "salaireBase": salaire.employe.salaire_base,
        "nbJourTotal": salaire.jour_heure_travaille,
        "primePresence": salaire.prime_presence,
        "primeTransport": salaire.prime_transport,
        "salaireBrut": salaire.salaire_brut,
        "retenueCNSS": salaire.cnss,
        "salaireImposable": salaire.salaire_imposable,
        "appointPlus": salaire.appointplus,
        "acompte": salaire.acompte,
        "impoRev": salaire.impots,
        "appointMoins": salaire.appointmoins,
        "CSS": salaire.css,
        "salaireNet": salaire.salaire_net,
        "modePaiment": salaire.mode_paiement,
        "mois": month_french,
        "annee": datetime.now().strftime("%Y")
    }

    template = get_template("fichedepaie.tex")
    rendered_tex = template.render(context)

    with tempfile.TemporaryDirectory() as tmpdirname:
        tex_file_path = os.path.join(tmpdirname, "fichedepaie.tex")
        pdf_file_path = os.path.join(tmpdirname, "fichedepaie.pdf")

        with open(tex_file_path, "w", encoding="utf-8") as tex_file:
            tex_file.write(rendered_tex)

        subprocess.run(["pdflatex", "-interaction=nonstopmode", tex_file_path], cwd=tmpdirname, check=True)

        with open(pdf_file_path, "rb") as pdf_file:
            pdf_data = pdf_file.read()

    employe_nom = re.sub(r'\s+', '_', salaire.employe.nom + " " + salaire.employe.prenom)
    mois = context["mois"]
    filename = f"{employe_nom}_{mois}_fichedepaie.pdf"

    response = HttpResponse(pdf_data, content_type="application/pdf")
    response["Content-Disposition"] = f'attachment; filename="{filename}"'
    response["Access-Control-Expose-Headers"] = "Content-Disposition"
    return response