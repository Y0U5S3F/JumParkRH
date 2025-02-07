from rest_framework import serializers
from .models import Service
from departement.models import Departement

class ServiceSerializer(serializers.ModelSerializer):
    departement = serializers.PrimaryKeyRelatedField(queryset=Departement.objects.all())

    class Meta:
        model = Service
        fields = ['id', 'nom', 'departement']
