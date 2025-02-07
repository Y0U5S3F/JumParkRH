from rest_framework import serializers
from .models import Departement

class DepartementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Departement
        fields = ['id', 'nom']