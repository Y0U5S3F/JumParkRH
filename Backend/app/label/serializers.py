from rest_framework import serializers
from .models import Label, LabelData

class LabelDataSerializer(serializers.ModelSerializer):
    startDate = serializers.DateTimeField(
        format="%Y-%m-%dT%H:%M:%S",
        input_formats=["%Y-%m-%dT%H:%M:%S"],
        allow_null=True,
        required=False
    )
    endDate = serializers.DateTimeField(
        format="%Y-%m-%dT%H:%M:%S",
        input_formats=["%Y-%m-%dT%H:%M:%S"],
        allow_null=True,
        required=False
    )
    startPause = serializers.DateTimeField(
        format="%Y-%m-%dT%H:%M:%S",
        input_formats=["%Y-%m-%dT%H:%M:%S"],
        allow_null=True,
        required=False
    )
    endPause = serializers.DateTimeField(
        format="%Y-%m-%dT%H:%M:%S",
        input_formats=["%Y-%m-%dT%H:%M:%S"],
        allow_null=True,
        required=False
    )

    class Meta:
        model = LabelData
        fields = '__all__'

class LabelSerializer(serializers.ModelSerializer):
    employe = serializers.CharField(source='employe.matricule')
    uid = serializers.IntegerField(source='employe.uid')
    data = LabelDataSerializer(many=True, read_only=True)

    class Meta:
        model = Label
        fields = ['id', 'employe', 'uid', 'data']
