from rest_framework import serializers
from .models import Absence, AbsenceType



class AbsenceTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = AbsenceType
        fields = [
            "id",
            "name",
            "color",
            "createdAt"
        ]
        
        
class AbsenceSerializer(serializers.ModelSerializer):
    reason_name = serializers.CharField(source='reason.name', read_only=True)
    user_name = serializers.CharField(source='user.full_name', read_only=True)
    class Meta:
        model = Absence
        fields = [
            "id",
            "user",
            "user_name",
            "title",
            "reason",
            "reason_name",
            "start_date",
            "end_date",
            "status",
            "createdAt"
        ]