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
from datetime import timedelta
from datetime import date

from django.db.models.functions import TruncMonth
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes


class AbsenceListCreateView(generics.ListCreateAPIView):
    queryset = Absence.objects.all()
    serializer_class = AbsenceSerializer
    permission_classes = [IsAuthenticated]
class AbsenceRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Absence.objects.all()
    serializer_class = AbsenceSerializer
    permission_classes = [IsAuthenticated]

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_stats(request):
    today = now().date()
    current_month = today.month
    current_year = today.year
    
    total_employes = Employe.objects.count()
    total_departements = Departement.objects.count()
    pending_vacation = Conge.objects.filter(status='en cours').count()
    
    next_public_holiday = JourFerie.objects.filter(date__gte=today).order_by('date').first()
    next_public_holiday_date = next_public_holiday.date if next_public_holiday else "No upcoming holidays"

    employe_distribution = Employe.objects.values('departement__nom').annotate(total=Count('matricule'))
    
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
    
    birthdays_this_month = Employe.objects.filter(date_de_naissance__month=current_month).values(
        "nom", "prenom", "date_de_naissance"
    )

    total_payroll = Salaire.objects.filter(created_at__year=current_year, created_at__month=current_month).aggregate(
        total=Sum('salaire_net')
    )["total"] or 0

    five_months_ago = today.replace(day=1) - timedelta(days=150)

    absences_last_5_months = (
    Absence.objects.filter(date__gte=five_months_ago, date__lte=today)
    .annotate(month=TruncMonth('date'))
    .values('month')
    .annotate(total=Count('id'))
    .order_by('month')
)

    response_data = {
        "statistiques": {
            "totalemployes": total_employes,
            "totaldepartements": total_departements,
            "pendingvacation": pending_vacation,
            "nextpublicholiday": str(next_public_holiday_date),
            "total_payroll_this_month": float(total_payroll)
        },
        "employedistribution": list(employe_distribution),
        "employes_on_leave": employes_on_leave,
        "birthdays_this_month": list(birthdays_this_month),
                "absences_last_5_months": list(absences_last_5_months),
    }

    return JsonResponse(response_data)