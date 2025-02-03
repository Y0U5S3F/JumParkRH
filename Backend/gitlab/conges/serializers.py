from rest_framework import serializers
from .models import Conge, CongeType



class CongeTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = CongeType
        fields = [
            "id",
            "name",
            "color",
            "createdAt"
        ]
        
        
class CongeSerializer(serializers.ModelSerializer):
    reason_name = serializers.CharField(source='reason.name', read_only=True)
    user_name = serializers.CharField(source='user.full_name', read_only=True)
    class Meta:
        model = Conge
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
