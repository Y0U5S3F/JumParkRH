from rest_framework import serializers
from .models import Appareil

class AppareilSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appareil
        fields = '__all__'
