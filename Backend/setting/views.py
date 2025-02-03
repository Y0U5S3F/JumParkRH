from django.shortcuts import render
from authentication.models import UserAccount
from .models import ConfigurationDays, OverlapPeriod, Schedule, OverlapPeriodType, WeeklySchedule, DaySchedule, Day
from .serializers import ScheduleSerializer, ConfigurationDaysSerializer, OverlapPeriodSerializer,WeeklyScheduleUpdateSerializer, WeeklyScheduleCreateSerializer,WeeklyScheduleSerializer, DayScheduleSerializer
from rest_framework.generics import ListAPIView
from django.views.decorators.csrf import csrf_exempt
import json
from django.http import HttpResponse
import datetime
from django.core.exceptions import ObjectDoesNotExist
from django.shortcuts import get_object_or_404
from rest_framework import generics

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

# Create your views here.

class ListSchedule(ListAPIView):
    queryset = Schedule.objects.all()
    serializer_class = ScheduleSerializer
    
    
class ListDay(ListAPIView):
    serializer_class = ConfigurationDaysSerializer
    
    def get_queryset(self):
        try:
            schedule_type_name = 'Default'
            overlap_period_type = get_object_or_404(OverlapPeriodType, name=schedule_type_name)
            
            queryset = ConfigurationDays.objects.filter(overlap_period__schedule_type=overlap_period_type)
            # queryset = ConfigurationDays.objects.all()
            return queryset
        except ObjectDoesNotExist:
            return ConfigurationDays.objects.none()          



class ListDayByUserId(ListAPIView):
    serializer_class = ConfigurationDaysSerializer
    
    def get_queryset(self):
        try:
            user_id = self.kwargs['user_id']  # Obtenez l'ID de l'utilisateur à partir de l'URL
            schedule_type_name = 'Default'
            overlap_period_type = get_object_or_404(OverlapPeriodType, name=schedule_type_name)
            print('user_id--', user_id)
            # Filtrer ConfigurationDays en fonction de l'utilisateur
            queryset = ConfigurationDays.objects.filter(overlap_period__user__id=user_id)
            return queryset
        except ObjectDoesNotExist:
            return ConfigurationDays.objects.none()    


class ListDayFlexible(ListAPIView):
    # queryset = ConfigurationDays.objects.all()
    serializer_class = ConfigurationDaysSerializer
    def get_queryset(self):
        try:
            schedule_type = 'Default'
            department_id = self.kwargs['department_id']

            overlap_period = OverlapPeriod.objects.filter(schedule_type=schedule_type, department_id=department_id).first()

            if overlap_period is not None:
                queryset = ConfigurationDays.objects.filter(overlap_period=overlap_period)
                return queryset
        except ObjectDoesNotExist:
            return ConfigurationDays.objects.none()    
        
class ListConfigurationPeriod(ListAPIView):
    queryset = OverlapPeriod.objects.all()
    serializer_class = OverlapPeriodSerializer
    
            
    

@csrf_exempt
def update_configuration_days(request):
    config_days_data = json.loads(request.body)
    print('data--', config_days_data)
    config_days_instances = []
    for config_day_data in config_days_data:
        config_day_id = int(config_day_data['id'])
        start_at = config_day_data['start_at']
        end_at = config_day_data['end_at']
        break_duration = config_day_data['break_duration']
        duration = config_day_data['duration']
        config_day_instance = ConfigurationDays(id=config_day_id, start_at=start_at, end_at=end_at, duration=duration, break_duration=break_duration )
        config_days_instances.append(config_day_instance)

    ConfigurationDays.objects.bulk_update(config_days_instances, ['start_at', 'end_at','duration','break_duration'])
    return HttpResponse('Configuration days updated successfully')





class WeeklyScheduleListCreateView(generics.ListCreateAPIView):
    queryset = WeeklySchedule.objects.all()
    serializer_class = WeeklyScheduleSerializer

class WeeklyScheduleDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = WeeklySchedule.objects.all()
    serializer_class = WeeklyScheduleSerializer

class DayScheduleListCreateView(generics.ListCreateAPIView):
    queryset = DaySchedule.objects.all()
    serializer_class = DayScheduleSerializer

class DayScheduleDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = DaySchedule.objects.all()
    serializer_class = DayScheduleSerializer
    
class WeeklyScheduleListByUserIdView(generics.ListAPIView):
    serializer_class = WeeklyScheduleSerializer
    # filter_backends = [DjangoFilterBackend]
    # filterset_class = WeeklyScheduleFilter

    def get_queryset(self):
        user_id = self.kwargs['user_id']
        queryset = WeeklySchedule.objects.filter(employee__id=user_id)
        return queryset



class WeeklyScheduleCreateView(APIView):
    def post(self, request, format=None):
        serializer = WeeklyScheduleCreateSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

from rest_framework.generics import ListCreateAPIView


class WeeklyScheduleBulkUpdateView(ListCreateAPIView):
    queryset = WeeklySchedule.objects.all()
    serializer_class = WeeklyScheduleUpdateSerializer

    def put(self, request, *args, **kwargs):
        for schedule_data in request.data:
            week_name = schedule_data['week_name']
            employee_id = schedule_data['employee'] 
            employee = UserAccount.objects.get(id=employee_id)

            start_date_of_week = schedule_data['start_date_of_week']
            end_date_of_week = schedule_data['end_date_of_week']

            # Get or create the WeeklySchedule
            instance, created = WeeklySchedule.objects.get_or_create(
                employee=employee,
                week_name=week_name,
                start_date_of_week=start_date_of_week,
                end_date_of_week=end_date_of_week
            )

            # Delete existing DaySchedule objects for this WeeklySchedule
            instance.dayschedule_set.all().delete()

            # Create new DaySchedule objects
            dayschedule_set_data = schedule_data.get('dayschedule_set', [])
            for dayschedule_data in dayschedule_set_data:
                day_name = dayschedule_data['day']
                day_instance, _ = Day.objects.get_or_create(name=day_name)
                DaySchedule.objects.create(
                    week_schedule=instance,
                    day=day_instance,
                    check_in=dayschedule_data['check_in'],
                    check_out=dayschedule_data['check_out']
                )

        return Response({'message': 'Schedules updated successfully'}, status=status.HTTP_200_OK)

