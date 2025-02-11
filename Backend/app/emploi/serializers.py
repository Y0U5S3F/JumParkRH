from rest_framework import serializers
from .models import Emploi

class EmploiSerializer(serializers.ModelSerializer):
    class Meta:
        model = Emploi
        fields = '__all__'