from rest_framework import serializers
from .models import Conge
from typeconge.models import TypeConge

class CongeSerializer(serializers.ModelSerializer):
    typeconge = serializers.PrimaryKeyRelatedField(queryset=TypeConge.objects.all())
    
    class Meta:
        model = Conge
        fields = '__all__'
