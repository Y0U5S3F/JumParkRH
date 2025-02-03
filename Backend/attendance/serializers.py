from rest_framework import serializers
from .models import Attendance
from datetime import datetime


class CustomDateField(serializers.DateTimeField):
    def to_representation(self, value):
            return value.strftime('%d/%m/%Y')
    
class CustomTimeField(serializers.DateTimeField):
    def to_representation(self, value):
        value_str = value.strftime('%H:%M:%S')
        datetime_obj = datetime.strptime(value_str, '%H:%M:%S')
        return datetime_obj.strftime('%H:%M')
    

class AttendanceSerializer(serializers.ModelSerializer):
    date = serializers.DateField(format='%d/%m/%Y')
    checkin = serializers.DateTimeField(format='%H:%M')
    checkout = serializers.DateTimeField(format='%H:%M')
    checkin_pause = serializers.DateTimeField(format='%H:%M')
    checkout_pause = serializers.DateTimeField(format='%H:%M')
    matricule = serializers.CharField(source='user.matricule', read_only=True)
    department = serializers.CharField(source='user.department', read_only=True)
    class Meta:
        model = Attendance
        fields = ('id','matricule','get_status','department','date','checkin','checkout','checkin_pause','checkout_pause','user','employee','duration','additional_hours','status')


class CreateAttendanceSerializer(serializers.ModelSerializer):

    class Meta:
        model = Attendance
        fields = ('id','date','checkin','checkout','checkin_pause','checkout_pause','user','employee','duration','additional_hours','status')