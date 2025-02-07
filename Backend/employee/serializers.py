from rest_framework import serializers
from .models import Employe

class EmployeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employe
        fields = '__all__'  # Include all model fields
