from django.shortcuts import render
from rest_framework import generics
from .models import Absence
from .serializers import AbsenceSerializer
from django.http import JsonResponse
from django.utils.timezone import now
from employe.models import Employe
from departement.models import Departement
from conge.models import Conge
from django.db.models import Count, Sum
from jourferie.models import JourFerie
from salaire.models import Salaire
from datetime import datetime


class AbsenceListCreateView(generics.ListCreateAPIView):
    queryset = Absence.objects.all()
    serializer_class = AbsenceSerializer

class AbsenceRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Absence.objects.all()
    serializer_class = AbsenceSerializer

def dashboard_stats(request):
    today = now().date()
    current_month = today.month
    current_year = today.year
    
    # General Stats
    total_employes = Employe.objects.count()
    total_departements = Departement.objects.count()
    pending_vacation = Conge.objects.filter(status='en cours').count()
    
    # Next public holiday
    next_public_holiday = JourFerie.objects.filter(date__gte=today).order_by('date').first()
    next_public_holiday_date = next_public_holiday.date if next_public_holiday else "No upcoming holidays"

    # Employee Distribution
    employe_distribution = Employe.objects.values('departement__nom').annotate(total=Count('matricule'))
    
    # Employees on leave today (congé & absence)
    employes_on_leave = []

    conges = Conge.objects.filter(startDate__lte=today, endDate__gte=today)
    for conge in conges:
        employes_on_leave.append({
            "nom": f"{conge.employe.nom} {conge.employe.prenom}",
            "departement": conge.employe.departement.nom,
            "return_date": conge.endDate,
            "type": "conge"
        })

    absences = Absence.objects.filter(date=today)
    for absence in absences:
        employes_on_leave.append({
            "nom": f"{absence.employe.nom} {absence.employe.prenom}",
            "departement": absence.employe.departement.nom,
            "type": "absence"
        })
    
    # Employee Birthdays This Month 🎂
    birthdays_this_month = Employe.objects.filter(date_de_naissance__month=current_month).values(
        "nom", "prenom", "date_de_naissance"
    )

    # Total Payroll Cost for the Month 💰
    total_payroll = Salaire.objects.filter(created_at__year=current_year, created_at__month=current_month).aggregate(
        total=Sum('salaire_net')
    )["total"] or 0

    response_data = {
        "statistiques": {
            "totalemployes": total_employes,
            "totaldepartements": total_departements,
            "pendingvacation": pending_vacation,
            "nextpublicholiday": str(next_public_holiday_date),
            "total_payroll_this_month": float(total_payroll)  # Convert to float for JSON serialization
        },
        "employedistribution": list(employe_distribution),
        "employes_on_leave": employes_on_leave,
        "birthdays_this_month": list(birthdays_this_month)
    }

    return JsonResponse(response_data)