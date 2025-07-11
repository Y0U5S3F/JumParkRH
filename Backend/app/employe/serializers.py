from rest_framework import serializers
from employe.models import Employe
from departement.models import Departement
from service.models import Service
from departement.serializers import DepartementSerializer
from service.serializers import ServiceSerializer
from django.utils.timezone import now
from django.contrib.auth.hashers import make_password


class EmployeSerializer(serializers.ModelSerializer):
    departement = DepartementSerializer(read_only=True)  
    service = ServiceSerializer(read_only=True)  
    
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

    password = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = Employe
        fields = [
            'matricule', 'nom', 'prenom', 'email', 'password', 'role', 'date_de_naissance', 
            'lieu_de_naissance', 'nationalite', 'genre_legal', 'situation_familiale', 'CIN', 
            'num_telephone', 'uid', 'adresse', 'ville', 'code_postal', 'nom_urgence', 
            'num_telephone_urgence', 'salaire_base', 'CNSS', 'compte_bancaire', 'rib_bancaire', 
            'departement', 'service', 'departement_id', 'service_id', 'created_at',
            'is_active', 'is_staff', 'is_superuser'
        ]

    def create(self, validated_data):
        password = validated_data.pop("password", None)
        validated_data["created_at"] = now()
        if password:
            validated_data["password"] = make_password(password)
        return Employe.objects.create(**validated_data)

    def update(self, instance, validated_data):
        if 'password' in validated_data:
            password = validated_data.pop('password')
            instance.password = make_password(password)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()
        return instance
    
class EmployeMinimalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employe
        fields = ['matricule', 'nom', 'prenom']
