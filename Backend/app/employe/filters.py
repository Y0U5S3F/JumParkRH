import django_filters
from .models import Employe

class EmployeFilter(django_filters.FilterSet):
    nom = django_filters.CharFilter(lookup_expr='icontains')
    prenom = django_filters.CharFilter(lookup_expr='icontains')
    email = django_filters.CharFilter(lookup_expr='icontains')
    role = django_filters.ChoiceFilter(choices=Employe.ROLE_CHOICES)
    genre_legal = django_filters.ChoiceFilter(choices=Employe.GENRE_CHOICES)
    situation_familiale = django_filters.ChoiceFilter(choices=Employe.SITUATION_CHOICES)
    departement = django_filters.CharFilter(field_name='departement_nom', lookup_expr='icontains')
    service = django_filters.CharFilter(field_name='service_nom', lookup_expr='icontains')
    date_de_naissance_min = django_filters.DateFilter(field_name='date_de_naissance', lookup_expr='gte')
    date_de_naissance_max = django_filters.DateFilter(field_name='date_de_naissance', lookup_expr='lte')
    is_active = django_filters.BooleanFilter()

    class Meta:
        model = Employe
        fields = [
            'matricule', 'nom', 'prenom', 'email', 'role', 'genre_legal', 
            'situation_familiale', 'departement', 'service', 'date_de_naissance_min', 
            'date_de_naissance_max', 'is_active'
        ]
