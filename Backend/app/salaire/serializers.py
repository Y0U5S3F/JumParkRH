from rest_framework import serializers
from .models import Salaire

class SalaireSerializer(serializers.ModelSerializer):
    class Meta:
        model = Salaire
        fields = '__all__'