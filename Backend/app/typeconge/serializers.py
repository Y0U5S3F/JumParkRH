from rest_framework import serializers
from .models import TypeConge

class TypeCongeSerializer(serializers.ModelSerializer):
    class Meta:
        model = TypeConge
        fields = '__all__'
