from rest_framework import serializers
from .models import JourFerie

class JourFerieSerializer(serializers.ModelSerializer):
    class Meta:
        model = JourFerie
        fields = '__all__'
