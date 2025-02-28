# label/serializers.py
from rest_framework import serializers
from .models import Label, LabelData

class LabelDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = LabelData
        fields = '__all__'

class LabelSerializer(serializers.ModelSerializer):
    employe = serializers.CharField(source='employe.matricule')
    service = serializers.IntegerField(source='service.id')

    data = LabelDataSerializer(many=True, read_only=True)

    class Meta:
        model = Label
        fields = ['id', 'employe', 'uid', 'data']

