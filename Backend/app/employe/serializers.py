from rest_framework import serializers
from employe.models import Employe
from departement.models import Departement
from service.models import Service
from departement.serializers import DepartementSerializer
from service.serializers import ServiceSerializer

class EmployeSerializer(serializers.ModelSerializer):
    departement = DepartementSerializer(read_only=True)  # Read-only nested serializer
    service = ServiceSerializer(read_only=True)  # Read-only nested serializer

    # Write-only fields for departement and service
    departement_id = serializers.PrimaryKeyRelatedField(
        queryset=Departement.objects.all(),
        source='departement',
        write_only=True
    )
    service_id = serializers.PrimaryKeyRelatedField(
        queryset=Service.objects.all(),
        source='service',
        write_only=True
    )

    class Meta:
        model = Employe
        fields = [
            'matricule', 'nom', 'prenom', 'email', 'role', 'date_de_naissance', 'lieu_de_naissance',
            'nationalite', 'genre_legal', 'situation_familiale', 'CIN', 'num_telephone', 'adresse',
            'ville', 'code_postal', 'nom_urgence', 'num_telephone_urgence', 'compte_bancaire',
            'rib_bancaire', 'departement', 'service', 'departement_id', 'service_id', 'created_at',
            'is_active', 'is_staff', 'is_superuser'
        ]

class EmployeMinimalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employe
        fields = ['matricule', 'nom', 'prenom']
