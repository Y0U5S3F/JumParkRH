from .models import Attendance
from rest_framework.generics import ListAPIView, CreateAPIView, DestroyAPIView, UpdateAPIView
from .serializers import AttendanceSerializer, CreateAttendanceSerializer
import datetime
from zk.base import ZK
from authentication.models import Employee
import datetime
from datetime import datetime
from django.http import JsonResponse
from django.contrib.auth import get_user_model
from datetime import datetime, time
from service.models import Service
from authentication.models import Employee
from department.models import Department
from absence.models import Absence
from conges.models import Conge
from holiday.models import Holiday
from datetime import timedelta, date
from django.views.decorators.csrf import csrf_exempt
from datetime import time
from django.utils import timezone
from django.core.cache import cache
from django.db import connection
from rest_framework.response import Response
import json
from setting.models import ConfigurationDays, OverlapPeriodType, OverlapPeriod
from rest_framework import generics, status
from django.dispatch import receiver
from django.db.models.signals import post_save
User = get_user_model()
from setting.serializers import WeeklyScheduleSerializer
from setting.models import WeeklySchedule, DaySchedule
from django.db.models import F, ExpressionWrapper, fields
from .tasks import celery_get_attendance_data_all
from django.db import transaction
from django.core.serializers.json import DjangoJSONEncoder
from device.models import Device
from django.db.models import Prefetch
from rest_framework.decorators import api_view

# class ListAttendances(ListAPIView):
#     # queryset = Attendance.objects.filter(user__is_deleted=False)
#     serializer_class = AttendanceSerializer
    
#     def get_queryset(self):
#         queryset = Attendance.objects.all()
#         queryset = queryset.filter(user__is_deleted=False)
#         return queryset
 
 
class AttendanceList(generics.ListCreateAPIView):
    queryset = Attendance.objects.filter(user__is_deleted=False).prefetch_related('user')
    serializer_class = AttendanceSerializer
    
class DeleteAttendanceAPIView(DestroyAPIView):
    """This endpoint allows for deletion of a specific Attendance from the database"""
    queryset = Attendance.objects.all()
    serializer_class = AttendanceSerializer

   
class ListAttendancesByDepartment(ListAPIView):
    serializer_class = AttendanceSerializer
    def get_queryset(self):
        queryset = Attendance.objects.all()
        department = self.request.query_params.get('department')
        start_date = self.request.query_params.get('start_date')
        end_date = self.request.query_params.get('end_date')

        if department:
            queryset = queryset.filter(user__department=department, user__is_deleted=False)

        if start_date and end_date:
            start_date = datetime.strptime(start_date, '%Y-%m-%d').date()
            end_date = datetime.strptime(end_date, '%Y-%m-%d').date()
            queryset = queryset.filter(date__range=[start_date, end_date])

        return queryset
    
class CreateAttendances(CreateAPIView):
    queryset = Attendance.objects.all()
    serializer_class = CreateAttendanceSerializer


class UpdateAttendances(UpdateAPIView):
    queryset = Attendance.objects.all()
    serializer_class = CreateAttendanceSerializer

    def calculate_duration(self, checkin, checkout):
        checkin_datetime = datetime.combine(datetime.today(), checkin)
        checkout_datetime = datetime.combine(datetime.today(), checkout)

        if checkout < checkin:
            checkout_datetime += timedelta(days=1)

        duration_timedelta = checkout_datetime - checkin_datetime
        duration_hours = duration_timedelta.total_seconds() / 3600

        if duration_hours > 8.0:
            overtime_timedelta = duration_timedelta - timedelta(hours=8)
            hours, remainder = divmod(overtime_timedelta.total_seconds(), 3600)
            minutes = remainder / 60
            duration = "08:00"  
            additional_hours = "{:02}:{:02}".format(int(hours), int(minutes))
        else:
            duration = "{:02}:{:02}".format(int(duration_hours), int((duration_hours % 1) * 60))
            additional_hours = "00:00"
        
        return duration, additional_hours

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)

        new_checkin = serializer.validated_data.get('checkin')
        new_checkout = serializer.validated_data.get('checkout')
        new_checkin_pause = serializer.validated_data.get('checkin_pause')
        new_checkout_pause = serializer.validated_data.get('checkout_pause')

        instance.checkin = new_checkin
        instance.checkout = new_checkout
        instance.checkin_pause = new_checkin_pause
        instance.checkout_pause = new_checkout_pause

            
        if new_checkin_pause and new_checkout_pause and new_checkin and new_checkout:

            checkin_datetime = datetime.combine(datetime.today(), new_checkin)
            checkout_pause_datetime = datetime.combine(datetime.today(), new_checkout_pause)
            checkin_pause_datetime = datetime.combine(datetime.today(), new_checkin_pause)
            checkout_datetime = datetime.combine(datetime.today(), new_checkout)
            # Ajustement de new_checkout si celui-ci est minuit
            if new_checkout < new_checkin:
                checkout_datetime += timedelta(days=1)
                
            print('new_checkin:', new_checkin)
            print('new_checkout:', new_checkout)
            print('new_checkin_pause:', new_checkin_pause)
            print('new_checkout_pause:', new_checkout_pause)
            if checkout_pause_datetime > checkin_datetime and checkout_datetime > checkin_pause_datetime:
                print('cas normal--', checkout_pause_datetime)
                print('cas normal--', checkin_datetime)
                d1 =  checkout_pause_datetime - checkin_datetime
                d2 =  checkout_datetime - checkin_pause_datetime
            else:
                print('2eme cas normal--', checkout_pause_datetime)

                checkin_datetime, checkout_pause_datetime = checkout_pause_datetime, checkin_datetime
                checkin_pause_datetime, checkout_datetime = checkout_datetime, checkin_pause_datetime

                d1 =  checkout_pause_datetime - checkin_datetime
                d2 =  checkout_datetime - checkin_pause_datetime
            
            total_duration = d1 + d2
            print("d1", d1)
            print("d2", d2)
            print("total_duration", total_duration)
            duration_hours = total_duration.total_seconds() / 3600

            if duration_hours > 8.0:
                overtime_hours = duration_hours - 8.0
                hours = int(overtime_hours)
                minutes = int((overtime_hours - hours) * 60)
                instance.duration = "08:00"
                instance.additional_hours = "{:02}:{:02}".format(hours, minutes)
            else:
                instance.duration = "{:02}:{:02}".format(int(duration_hours), int((duration_hours % 1) * 60))
                instance.additional_hours = "00:00"

        elif new_checkin and new_checkout:
            instance.duration, instance.additional_hours = self.calculate_duration(new_checkin, new_checkout)

        instance.save()

        return Response(serializer.data)






@csrf_exempt
@transaction.atomic
def get_attendance_data_all(request):
    
    celery_get_attendance_data_all.delay()  # Call the Celery task asynchronously

    # zk = ZK('192.168.1.203', port=4370)
    first_device = Device.objects.first()
    if first_device:
        ip = first_device.ip
        port = first_device.port
    else:
            # Handle the case when there are no devices in the table
        return JsonResponse({'error': 'No devices found'}, status=400)
        
    zk = ZK(ip, port=port)
    conn = zk.connect()
    attendance_list = []
    error_list = []
    cache_key = 'attendance_data'
    # Check if attendance data is present in cache
    cached_data = cache.get(cache_key)
    if cached_data:
        return JsonResponse(cached_data, safe=False)

    if conn:
        print("Connected to device")
        zk.disable_device()
        
        if zk.enable_device():
            print("Device is enabled")
            attendance_records = zk.get_attendance()
            print('zk---', attendance_records)

            user_ids = [record.user_id for record in attendance_records]

            # Fetch the corresponding users in a separate query
            users = User.objects.filter(matricule__in=user_ids)
            user_dict = {user.matricule: user for user in users}
            users_id = zk.get_users()
            print('test user data---', users_id)
            for user_id in users_id:
                # Check if user exists in the device
                if not User.objects.filter(matricule=user_id.user_id).exists():
                    data= {
                        "user": user_id.name,
                        "user_id": user_id.user_id,
                        "email": f"{user_id.user_id}@gmail.com",
                        }
                    error_list.append(data)
                    continue

            # Filter attendance records for the current month
            current_month = timezone.now().month
            current_year = timezone.now().year
            print('test year--',current_year )
            print('test current_month--',current_month )
            attendance_records = [record for record in attendance_records if record.timestamp.month == current_month and record.timestamp.year == current_year]
            # attendance_records = attendance_records.select_related('user')
            for record in attendance_records:
                user_id =record.user_id
                # user =record.user
                # # user = user_dict.get(record.user_id)
                # try:
                #     user = User.objects.get(matricule=user_id)
                # except User.DoesNotExist:
                #     user = None  # or perform other actions as needed
                user = User.objects.get(matricule=user_id)
                attendance_dict = {
                    "user": record.user_id,
                    "checkin": None,
                    "checkout": None,
                    "date": record.timestamp.strftime("%d-%m-%Y"),
                    "duration": None,
                    "additional_hours": None
                }
                if record.punch == 0:
                    attendance_dict["checkin"] = record.timestamp.strftime("%H:%M:%S")
                elif record.punch == 1:
                    attendance_dict["checkout"] = record.timestamp.strftime("%H:%M:%S")

                attendance, created = Attendance.objects.get_or_create(
                    date=datetime.combine(record.timestamp.date(), datetime.min.time()),
                    user=user,
                )
                if attendance_dict["checkin"]:
                    checkin_time =datetime.strptime(attendance_dict["checkin"], "%H:%M:%S").time()
                    attendance.checkin = datetime.strptime(attendance_dict["checkin"], "%H:%M:%S").time()
                    # # Check for delay
                    # checkin_datetime = datetime.combine(datetime.today(), checkin_time)
                    # delay_threshold = timedelta(minutes=5)
                    # if checkin_datetime > datetime.now() + delay_threshold:
                    #     # Save the delay in the "Retard" table
                    #     retard = Delay.objects.create(employee=user, checkin=checkin_time)

                if attendance_dict["checkout"]:
                    checkout_time = datetime.strptime(attendance_dict["checkout"], "%H:%M:%S").time()
                    attendance.checkout = datetime.strptime(attendance_dict["checkout"], "%H:%M:%S").time()
                attendance.status = 'Present'
                
                attendance.save()
                attendance_list.append(attendance_dict)
                checkin =attendance.checkin
                checkout =attendance.checkout
                if checkin and checkout:
                        checkin = datetime.combine(datetime.today(), checkin)
                        checkout = datetime.combine(datetime.today(), checkout)
                        if checkin <= checkout:
                            duration = checkout - checkin
                        else:
                            duration = timedelta(days=1) - (checkin - checkout)
                        hours, remainder = divmod(duration.seconds, 3600)
                        minutes, seconds = divmod(remainder, 60)
                        duration_str = f"{hours:02d}:{minutes:02d}"
                        if duration_str:
                            hours, minutes = map(int, duration_str.split(':'))
                            duration_float = hours + minutes / 60
                            duration_timedelta = timedelta(hours=duration_float)
                            duration_string = str(duration_timedelta)
                            if datetime.strptime(duration_string, "%H:%M:%S") > datetime.strptime("08:00:00", "%H:%M:%S"):
                                additionalHours_duration = datetime.strptime(duration_string, "%H:%M:%S") - datetime.strptime("08:00:00", "%H:%M:%S")
                                additionalHours = str(additionalHours_duration)
                                hours, remainder = divmod(additionalHours_duration.seconds, 3600)
                                minutes, seconds = divmod(remainder, 60)
                                additionalHours = f"{hours:02d}:{minutes:02d}"
                                duration = time(8, 0, 0)
                                duration_str = duration.strftime("%H:%M")
                                
                            else:
                                duration_str = duration_str
                                # duration_str= duration
                                additionalHours= "00:00"
                        else:
                            duration_str= "00:00"
                            additionalHours= "00:00"

                else:
                    duration_str= "00:00"
                    additionalHours= "00:00"
                Attendance.objects.update_or_create(
                                user=user,
                                date=datetime.combine(record.timestamp.date(), datetime.min.time()),
                                defaults={
                                'checkin': checkin, 
                                # 'checkin_pause': checkin_pause_time, 
                                # 'checkout_pause': checkout_pause_time, 
                                'checkout': checkout,
                                'duration': duration_str, 
                                'additional_hours': additionalHours
                                # duration=newAttendance.duration, 
                                # additionalHours=newAttendance.additionalHours
                                                }
                                            )     
                attendance_list.append(attendance_dict)
            if error_list:
                return JsonResponse(error_list, safe=False, status=400)
            
            # Cache the attendance data for future use             
            cache.set(cache_key, attendance_list)

            zk.enable_device()
        else:
            print("Unable to enable device")

        zk.disconnect()
    else:
        print("Unable to connect to device")
        return Response({'error': 'Unable to connect to device'}, status=status.HTTP_400_BAD_REQUEST)


    # Mettre en cache les résultats
    cache.set(cache_key, attendance_list, timeout=3600)  # Cache pendant 1 heure
    print('attendance_list--', attendance_list)
    return JsonResponse(attendance_list, safe=False)

from django.core.exceptions import MultipleObjectsReturned


@csrf_exempt
def get_attendance_data(request):
    # Get the first device's IP and port
    first_device = Device.objects.first()
    if first_device:
        ip = first_device.ip
        port = first_device.port
    else:
        # Handle the case when there are no devices in the table
        return JsonResponse({'error': 'No devices found'}, status=400)

    # zk = ZK(ip, port=port)
    zk = ZK('41.224.5.17', port=4370)
    conn = zk.connect()
    attendance_list = []
    error_list = []
    cache_key = 'attendance_data'
    # Check if attendance data is present in cache
    cached_data = cache.get(cache_key)
    if cached_data:
        return JsonResponse(cached_data, safe=False)

    if conn:
        print("Connected to device")
        zk.disable_device()
        
        if zk.enable_device():
            print("Device is enabled")
            attendance_records = zk.get_attendance()
            print('zk---', attendance_records)

            user_ids = [record.user_id for record in attendance_records]

            # Fetch the corresponding users in a separate query
            users = User.objects.filter(matricule__in=user_ids)
            user_dict = {user.matricule: user for user in users}
            users_id = zk.get_users()
            print('test user data---', users_id)
            for user_id in users_id:
                # Check if user exists in the device
                if not User.objects.filter(matricule=user_id.user_id).exists():
                    data= {
                        "user": user_id.name,
                        "user_id": user_id.user_id,
                        "email": f"{user_id.user_id}@gmail.com",
                        }
                    error_list.append(data)
                    continue

            # Filter attendance records for the current month
            current_month = timezone.now().month
            # current_month = 5
            current_year = timezone.now().year
            print('test year--',current_year )
            print('test current_month--',current_month )
            # Calculate the date for 3 days ago
            three_days_ago = datetime.today() - timedelta(days=1)
            print('three_days_ago -----',three_days_ago )
            attendance_records = [record for record in attendance_records if record.timestamp.month == current_month and record.timestamp.year == current_year]
            for record in attendance_records:
                if record.timestamp >= three_days_ago:
                    user_id =record.user_id
                    # # user = user_dict.get(record.user_id)
                    # try:
                    #     user = User.objects.get(matricule=user_id)
                    # except User.DoesNotExist:
                    #     user = None  # or perform other actions as needed
                    # user = User.objects.get(matricule=user_id)
                    user = User.objects.filter(matricule=user_id).first()
                    if not user:
                        continue
                    attendance_dict = {
                        "user": record.user_id,
                        "checkin": None,
                        "checkout": None,
                        "date": record.timestamp.strftime("%d-%m-%Y"),
                        "duration": None,
                        "additional_hours": None
                    }
                    if record.punch == 0:
                        attendance_dict["checkin"] = record.timestamp.strftime("%H:%M:%S")
                    elif record.punch == 1:
                        attendance_dict["checkout"] = record.timestamp.strftime("%H:%M:%S")

                    # attendance, created = Attendance.objects.get_or_create(
                    #     date=datetime.combine(record.timestamp.date(), datetime.min.time()),
                    #     user=user,
                    # )
                    try:
                        attendance, created = Attendance.objects.get_or_create(
                            date=datetime.combine(record.timestamp.date(), datetime.min.time()),
                            user=user,
                        )
                    except MultipleObjectsReturned:
                        attendances = Attendance.objects.filter(
                            date=datetime.combine(record.timestamp.date(), datetime.min.time()),
                            user=user
                        )
                        attendance = attendances.first()
                        created = False
                    if attendance_dict["checkin"]:
                        checkin_time =datetime.strptime(attendance_dict["checkin"], "%H:%M:%S").time()
                        attendance.checkin = datetime.strptime(attendance_dict["checkin"], "%H:%M:%S").time()
                        # # Check for delay
                        # checkin_datetime = datetime.combine(datetime.today(), checkin_time)
                        # delay_threshold = timedelta(minutes=5)
                        # if checkin_datetime > datetime.now() + delay_threshold:
                        #     # Save the delay in the "Retard" table
                        #     retard = Delay.objects.create(employee=user, checkin=checkin_time)

                    if attendance_dict["checkout"]:
                        checkout_time = datetime.strptime(attendance_dict["checkout"], "%H:%M:%S").time()
                        attendance.checkout = datetime.strptime(attendance_dict["checkout"], "%H:%M:%S").time()
                    attendance.status = 'Present'
                    
                    attendance.save()
                    attendance_list.append(attendance_dict)
                    checkin =attendance.checkin
                    checkout =attendance.checkout
                    if checkin and checkout:
                            checkin = datetime.combine(datetime.today(), checkin)
                            checkout = datetime.combine(datetime.today(), checkout)
                            if checkin <= checkout:
                                duration = checkout - checkin
                            else:
                                duration = timedelta(days=1) - (checkin - checkout)
                            hours, remainder = divmod(duration.seconds, 3600)
                            minutes, seconds = divmod(remainder, 60)
                            duration_str = f"{hours:02d}:{minutes:02d}"
                            if duration_str:
                                hours, minutes = map(int, duration_str.split(':'))
                                duration_float = hours + minutes / 60
                                duration_timedelta = timedelta(hours=duration_float)
                                duration_string = str(duration_timedelta)
                                if datetime.strptime(duration_string, "%H:%M:%S") > datetime.strptime("08:00:00", "%H:%M:%S"):
                                    additionalHours_duration = datetime.strptime(duration_string, "%H:%M:%S") - datetime.strptime("08:00:00", "%H:%M:%S")
                                    additionalHours = str(additionalHours_duration)
                                    hours, remainder = divmod(additionalHours_duration.seconds, 3600)
                                    minutes, seconds = divmod(remainder, 60)
                                    additionalHours = f"{hours:02d}:{minutes:02d}"
                                    duration = time(8, 0, 0)
                                    duration_str = duration.strftime("%H:%M")
                                    
                                else:
                                    duration_str = duration_str
                                    # duration_str= duration
                                    additionalHours= "00:00"
                            else:
                                duration_str= "00:00"
                                additionalHours= "00:00"

                    else:
                        duration_str= "00:00"
                        additionalHours= "00:00"
                    # Attendance.objects.update_or_create(
                    #                 user=user,
                    #                 date=datetime.combine(record.timestamp.date(), datetime.min.time()),
                    #                 defaults={
                    #                 'checkin': checkin, 
                    #                 # 'checkin_pause': checkin_pause_time, 
                    #                 # 'checkout_pause': checkout_pause_time, 
                    #                 'checkout': checkout,
                    #                 'duration': duration_str, 
                    #                 'additional_hours': additionalHours
                    #                 # duration=newAttendance.duration, 
                    #                 # additionalHours=newAttendance.additionalHours
                    #                                 }
                    #                             )     
                    # attendance_list.append(attendance_dict)
                    Attendance.objects.filter(
                        user=user,
                        date=datetime.combine(record.timestamp.date(), datetime.min.time())
                    ).update(
                            checkin=checkin,
                            checkout=checkout,
                            duration=duration_str,
                            additional_hours=additionalHours
                    )
                    attendance_list.append(attendance_dict)
            if error_list:
                return JsonResponse(error_list, safe=False, status=400)
            
            # Cache the attendance data for future use             
            cache.set(cache_key, attendance_list)

            zk.enable_device()
        else:
            print("Unable to enable device")

        zk.disconnect()
    else:
        print("Unable to connect to device")
        return Response({'error': 'Unable to connect to device'}, status=status.HTTP_400_BAD_REQUEST)


    # Mettre en cache les résultats
    # cache.set('attendance_list', attendance_list, timeout=1)  # Cache pendant 1 heure
    print('attendance_list--', attendance_list)
    return JsonResponse(attendance_list, safe=False)








# @csrf_exempt
# def get_attendance_data_retard(request):
#     updated_records = []  # Créez une liste pour stocker les enregistrements mis à jour

#     try:
#         records = Attendance.objects.all()
        
#         for record in records:
#             date = record.date
#             user = record.user
#             checkin = record.checkin
#             checkout = record.checkout
#             weekday = date.strftime('%A')

#             try:
#                 configuration = ConfigurationDays.objects.get(overlap_period__user=user, weekday=weekday)

#                 planned_start_time = configuration.start_at
#                 planned_start = configuration.start_at
#                 planned_start_time = datetime.combine(datetime.today(), planned_start_time)
#                 planned_start = datetime.combine(datetime.today(), planned_start)
#                 planned_start_time += timedelta(minutes=5)

#                 if isinstance(checkin, time):
#                     # Convertir checkin en datetime si ce n'est pas déjà le cas
#                     checkin_datetime = datetime.combine(datetime.today(), checkin)
#                 else:
#                     checkin_datetime = checkin

#                 if checkin_datetime > planned_start_time:
#                     planned_start += timedelta(hours=1)
#                     checkin_datetime = planned_start
#                 elif checkin_datetime <= planned_start_time:
#                     checkin_datetime = planned_start

#                 if checkin and checkout:
#                     checkout_datetime = datetime.combine(datetime.today(), checkout)

#                     if checkout_datetime < checkin_datetime:
#                         checkout_datetime += timedelta(days=1)
                        
#                     duration_timedelta = checkout_datetime - checkin_datetime
#                     duration_hours = duration_timedelta.total_seconds() / 3600

#                     if duration_hours > 8.0:
#                         overtime_timedelta = duration_timedelta - timedelta(hours=8)
#                         hours, remainder = divmod(overtime_timedelta.total_seconds(), 3600)
#                         minutes = remainder / 60
#                         duration = "08:00"
#                         additional_hours = "{:02}:{:02}".format(int(hours), int(minutes))
#                     else:
#                         duration = "{:02}:{:02}".format(int(duration_hours), int((duration_hours % 1) * 60))
#                         additional_hours = "00:00"
#                     # Mettre à jour l'enregistrement d'assiduité
#                     record.checkin = checkin_datetime.time()  # Extraire l'heure en time
#                     record.duration = duration
#                     record.additional_hours = additional_hours
#                     record.save()
#                     updated_records.append({
#                         "user": user.id,
#                         "checkin": checkin_datetime.time(),
#                         "duration": duration,
#                         "additional_hours": additional_hours
#                     })
#             except ConfigurationDays.DoesNotExist:
#                 pass
#     except Exception as e:
#         print("Une exception s'est produite :", str(e))
    
#     # Renvoyer les enregistrements mis à jour sous forme de réponse JSON
#     return JsonResponse({"message": "Mise à jour avec succès", "updated_records": updated_records}, safe=False)


@csrf_exempt
@transaction.atomic
def get_attendance_data_retard(request):
    updated_records = []  # Créez une liste pour stocker les enregistrements mis à jour

    try:
        # Récupérez le mois et l'année actuels
        current_month = datetime.today().month
        current_year = datetime.today().year

        # Récupérez tous les enregistrements d'assiduité pour le mois en cours
        records = Attendance.objects.filter(date__month=current_month, date__year=current_year)

        for record in records:
            date = record.date
            user = record.user
            checkin = record.checkin
            checkout = record.checkout
            weekday = date.strftime('%A')
            try:
                configuration = ConfigurationDays.objects.get(overlap_period__user=user, weekday=weekday)

                planned_start_time = configuration.start_at
                planned_start = configuration.start_at
                planned_start_time = datetime.combine(datetime.today(), planned_start_time)
                planned_start = datetime.combine(datetime.today(), planned_start)
                planned_start_time += timedelta(minutes=5)
                if checkin:
                    if isinstance(checkin, time):
                        # Convertir checkin en datetime si ce n'est pas déjà le cas
                        checkin_datetime = datetime.combine(datetime.today(), checkin)
                    else:
                        checkin_datetime = checkin

                    if checkin_datetime > planned_start_time:
                        planned_start += timedelta(hours=1)
                        checkin_datetime = planned_start
                    elif checkin_datetime <= planned_start_time:
                        checkin_datetime = planned_start
                else:
                    pass
                if checkin and checkout:
                    checkout_datetime = datetime.combine(datetime.today(), checkout)

                    if checkout_datetime < checkin_datetime:
                        checkout_datetime += timedelta(days=1)
                        
                    duration_timedelta = checkout_datetime - checkin_datetime
                    duration_hours = duration_timedelta.total_seconds() / 3600

                    if duration_hours > 8.0:
                        overtime_timedelta = duration_timedelta - timedelta(hours=8)
                        hours, remainder = divmod(overtime_timedelta.total_seconds(), 3600)
                        minutes = remainder / 60
                        duration = "08:00"
                        additional_hours = "{:02}:{:02}".format(int(hours), int(minutes))
                    else:
                        duration = "{:02}:{:02}".format(int(duration_hours), int((duration_hours % 1) * 60))
                        additional_hours = "00:00"
                    # Mettre à jour l'enregistrement d'assiduité
                    record.checkin = checkin_datetime.time()  # Extraire l'heure en time
                    record.duration = duration
                    record.additional_hours = additional_hours
                    record.save()
                    updated_records.append({
                        "user": user.id,
                        "checkin": checkin_datetime.time(),
                        "duration": duration,
                        "additional_hours": additional_hours
                    })
            except ConfigurationDays.DoesNotExist:
                pass
    except Exception as e:
        print("Une exception s'est produite :", str(e))
    
    # Renvoyer les enregistrements mis à jour sous forme de réponse JSON
    return JsonResponse({"message": "Mise à jour avec succès", "updated_records": updated_records}, safe=False)


# @csrf_exempt
# def get_attendance_data_retard(request):
    
#     zk = ZK('192.168.1.203', port=4370)
#     conn = zk.connect()
#     attendance_list = []
#     error_list = []
#     cache_key = 'attendance_data'
#     # Check if attendance data is present in cache
#     cached_data = cache.get(cache_key)
#     if cached_data:
#         return JsonResponse(cached_data, safe=False)

#     if conn:
#         print("Connected to device")
#         zk.disable_device()
        
#         if zk.enable_device():
#             print("Device is enabled")
#             attendance_records = zk.get_attendance()

#             user_ids = [record.user_id for record in attendance_records]

#             # Fetch the corresponding users in a separate query
#             users = User.objects.filter(matricule__in=user_ids)
#             user_dict = {user.matricule: user for user in users}
#             users_id = zk.get_users()
#             print('test user data---', users_id)
#             for user_id in users_id:
#                 # Check if user exists in the device
#                 if not User.objects.filter(matricule=user_id.user_id).exists():
#                     data= {
#                         "user": user_id.name,
#                         "user_id": user_id.user_id,
#                         "email": f"{user_id.user_id}@gmail.com",
#                         }
#                     error_list.append(data)
#                     continue

#             # Filter attendance records for the current month
#             current_month = timezone.now().month
#             current_year = timezone.now().year
#             print('test year--',current_year )
#             print('test current_month--',current_month )
#             attendance_records = [record for record in attendance_records if record.timestamp.month == current_month and record.timestamp.year == current_year]
#             for record in attendance_records:
#                 user_id =record.user_id
#                 # # user = user_dict.get(record.user_id)
#                 # try:
#                 #     user = User.objects.get(matricule=user_id)
#                 # except User.DoesNotExist:
#                 #     user = None  # or perform other actions as needed
#                 user = User.objects.get(matricule=user_id)
#                 attendance_dict = {
#                     "user": record.user_id,
#                     "checkin": None,
#                     "checkout": None,
#                     "date": record.timestamp.strftime("%d-%m-%Y"),
#                     "duration": None,
#                     "additional_hours": None
#                 }
#                 if record.punch == 0:
#                     attendance_dict["checkin"] = record.timestamp.strftime("%H:%M:%S")
#                 elif record.punch == 1:
#                     attendance_dict["checkout"] = record.timestamp.strftime("%H:%M:%S")

#                 attendance, created = Attendance.objects.get_or_create(
#                     date=datetime.combine(record.timestamp.date(), datetime.min.time()),
#                     user=user,
#                 )
#                 if attendance_dict["checkin"]:
#                     print('tst checkin')
#                     checkin_time = datetime.strptime(attendance_dict["checkin"], "%H:%M:%S").time()
#                     # attendance.checkin = datetime.strptime(attendance_dict["checkin"], "%H:%M:%S").time()

#                     day_of_week = datetime.today().strftime('%A')
#                     try:
#                         print('test try')
#                         configuration = ConfigurationDays.objects.get(overlap_period__user=user, weekday=record.timestamp.strftime('%A'))
#                         planned_start_time = configuration.start_at
#                         planned_start_datetime = datetime.combine(record.timestamp.date(), planned_start_time)
#                         print('planned_start_datetime', planned_start_datetime)
#                         print('checkin_time', checkin_time)
#                         print('user', user)
#                         if checkin_time > planned_start_datetime:
#                             print('test aprés le pointage')

#                             # L'employé est en retard, appliquez votre règle ici (par exemple, réduisez la durée de travail)
#                             # attendance.duration -= timedelta(hours=1)  # Réduction d'1 heure
#                             planned_start_datetime +=  timedelta(hours=1)
#                             attendance.checkin = planned_start_datetime
#                         elif checkin_time < planned_start_datetime:
#                             print('test avant le pointage')
#                             attendance.checkin = planned_start_datetime

#                     except ConfigurationDays.DoesNotExist:
#                         # Aucune configuration trouvée pour ce jour de la semaine
#                         pass  # Vous pouvez mettre votre code de gestion pour ce cas ici

#                 if attendance_dict["checkout"]:
#                     checkout_time = datetime.strptime(attendance_dict["checkout"], "%H:%M:%S").time()
#                     attendance.checkout = datetime.strptime(attendance_dict["checkout"], "%H:%M:%S").time()
#                 attendance.status = 'Present'
                
#                 attendance.save()
#                 attendance_list.append(attendance_dict)
#                 checkin =attendance.checkin
#                 checkout =attendance.checkout
#                 if checkin and checkout:
#                         checkin = datetime.combine(datetime.today(), checkin)
#                         checkout = datetime.combine(datetime.today(), checkout)
#                         if checkin <= checkout:
#                             duration = checkout - checkin
#                         else:
#                             duration = timedelta(days=1) - (checkin - checkout)
#                         hours, remainder = divmod(duration.seconds, 3600)
#                         minutes, seconds = divmod(remainder, 60)
#                         duration_str = f"{hours:02d}:{minutes:02d}"
#                         if duration_str:
#                             hours, minutes = map(int, duration_str.split(':'))
#                             duration_float = hours + minutes / 60
#                             duration_timedelta = timedelta(hours=duration_float)
#                             duration_string = str(duration_timedelta)
#                             if datetime.strptime(duration_string, "%H:%M:%S") > datetime.strptime("08:00:00", "%H:%M:%S"):
#                                 additionalHours_duration = datetime.strptime(duration_string, "%H:%M:%S") - datetime.strptime("08:00:00", "%H:%M:%S")
#                                 additionalHours = str(additionalHours_duration)
#                                 hours, remainder = divmod(additionalHours_duration.seconds, 3600)
#                                 minutes, seconds = divmod(remainder, 60)
#                                 additionalHours = f"{hours:02d}:{minutes:02d}"
#                                 duration = time(8, 0, 0)
#                                 duration_str = duration.strftime("%H:%M")
                                
#                             else:
#                                 duration_str = duration_str
#                                 # duration_str= duration
#                                 additionalHours= "00:00"
#                         else:
#                             duration_str= "00:00"
#                             additionalHours= "00:00"

#                 else:
#                     duration_str= "00:00"
#                     additionalHours= "00:00"
#                 Attendance.objects.update_or_create(
#                                 user=user,
#                                 date=datetime.combine(record.timestamp.date(), datetime.min.time()),
#                                 defaults={
#                                 'checkin': checkin, 
#                                 # 'checkin_pause': checkin_pause_time, 
#                                 # 'checkout_pause': checkout_pause_time, 
#                                 'checkout': checkout,
#                                 'duration': duration_str, 
#                                 'additional_hours': additionalHours
#                                 # duration=newAttendance.duration, 
#                                 # additionalHours=newAttendance.additionalHours
#                                                 }
#                                             )     
#                 attendance_list.append(attendance_dict)
#             if error_list:
#                 return JsonResponse(error_list, safe=False, status=400)
            
#             # Cache the attendance data for future use             
#             cache.set(cache_key, attendance_list)

#             zk.enable_device()
#         else:
#             print("Unable to enable device")
#             return Response({'error': 'Unable to connect to device'}, status=status.HTTP_400_BAD_REQUEST)

#         zk.disconnect()
#     else:
#         print("Unable to connect to device")
#         return Response({'error': 'Unable to connect to device'}, status=status.HTTP_400_BAD_REQUEST)

#     # Mettre en cache les résultats
#     # cache.set('attendance_list', attendance_list, timeout=1)  # Cache pendant 1 heure
#     print('attendance_list--', attendance_list)
#     return JsonResponse(attendance_list, safe=False)


@csrf_exempt
@transaction.atomic
def monthly_recap(request):
    try:
        # selectedDept = 1
        # dateDeb = "2023-05-01"
        # dateFin = "2023-05-10"
        data = json.loads(request.body)
        selectedDept = data['selectedDept']
        dateDeb = data['dateDeb']
        dateFin = data['dateFin']

    except:
        return JsonResponse(['ERROR'], safe=False)
    empsID = Employee.objects.filter(department_id=selectedDept).values(
        'id','matricule', 'first_name', 'last_name', 'fonction_id')
    dept = Department.objects.filter(id=selectedDept).values_list('name', 'id')
    name_department, id_department = dept[0] if dept else (None, None)
    result = []
    print('despp', dept)
    print('empsID----', empsID)
    for empID in empsID:
        print('test for11-----')
        empService = Service.objects.filter(
            id=empID['fonction_id']).values_list('name', flat=True)

        empCost = 0
        percentage = 0
        jour_sup = 0
        listAttendancesOfSelectedEmp = Attendance.objects.filter(user__is_deleted=False, user_id=empID['id']).values(
            'duration', 'additional_hours', 'date', 'user_id')
        listAttendances = []
        print('test ttt', listAttendancesOfSelectedEmp)

        empHeureSupplimentaire = 0
        empHeure = 0
        dictEmp = {
            'id': empID['matricule'],
            'matricule': empID['matricule'],
            'full_name': empID['first_name'],
            'nbHeureTrav': 0, 
            'nbJourTrav': 0,
            'nbJourSup': 0,
            'HeureSupplimentaire': 0,
            'conge': 0,
            # 'autorisationPaye': 0,
            # 'maladie': 0,
            # 'maternite': 0,
            'absance': 0,
            'autorisation': 0,
            'jourFerie': 0,
            # 'MensuelHoraire': empID['typeSalaire'],
            'service': empService[0],
            'department': name_department,
            'department_id': id_department,

        }
        print('nbHeureTrav----', dictEmp['nbHeureTrav'])
        for attendance in listAttendancesOfSelectedEmp:
            print('test ttt')
            print('test dictEmp', dictEmp['nbHeureTrav'])
            print(type(attendance['duration']))
            print(attendance['duration'])
            duration_time = datetime.strptime(attendance['duration'], '%H:%M').time()
            duration_str_formatted = duration_time.strftime('%H:%M:%S')
            print(duration_str_formatted)
            additionalHours_time = datetime.strptime(attendance['additional_hours'], '%H:%M').time()
            additionalHours_str_formatted = additionalHours_time.strftime('%H:%M:%S')
            print(additionalHours_str_formatted)
            if convertDate(dateDeb) <= attendance['date'] <= convertDate(dateFin):
                durationStr = duration_str_formatted
                additionalHoursStr = additionalHours_str_formatted
                durationInt = convertTime(durationStr).seconds/3600
                additionalHoursInt = convertTime(
                additionalHoursStr).seconds/3600
                percentage = durationInt / 8
                jour_sup = additionalHoursInt / 8
                dictEmp['nbJourTrav'] += percentage
                dictEmp['nbJourSup'] += jour_sup
                dictEmp['nbHeureTrav'] += durationInt
                dictEmp['HeureSupplimentaire'] += additionalHoursInt
        total_days = dictEmp['nbJourTrav'] + dictEmp['nbJourSup']
        total_heures = dictEmp['nbHeureTrav'] + dictEmp['HeureSupplimentaire']
        if total_days > 26:
            total_days = total_days - 26
            dictEmp['nbJourTrav'] = 26
            dictEmp['nbJourSup'] = total_days
        else:
            dictEmp['nbJourTrav'] = total_days
            dictEmp['nbJourSup'] = 0
            
        if total_heures > 208:
            total_heures = total_heures - 208
            dictEmp['nbHeureTrav'] = 208
            dictEmp['HeureSupplimentaire'] = total_heures
        else:
            dictEmp['nbHeureTrav'] = total_heures
            dictEmp['HeureSupplimentaire'] = 0
            

        tabAbsance = Absence.objects.filter(status='Valider', user_id=empID['id']).values(
                'reason', 'start_date', 'end_date', 'absence_start_time', 'absence_end_time')
        for absance in tabAbsance:
                absanceDate = convertDate(str(absance['start_date']))
                while True:
                    if absanceDate > convertDate(str(absance['end_date'])):
                        break
                    if convertDate(dateDeb) <= convertDate(str(absanceDate)) <= convertDate(dateFin):
                        dictEmp['absance'] += 1
                    else:
                        break
                    absanceDate = convertDate(str(absanceDate)) + timedelta(days=1)

        tabConge = Conge.objects.filter(status='Valider',
                user_id=empID['id']).values('reason', 'start_date', 'end_date', 'conge_start_time', 'conge_end_time')
        for conge in tabConge:
            congeDate = convertDate(str(conge['start_date']))
            while True:
                if congeDate > convertDate(str(conge['end_date'])):
                        break
                if convertDate(dateDeb) <= convertDate(str(congeDate)) <= convertDate(dateFin):
                        dictEmp['conge'] += 1
                        
                else:
                        break
                congeDate = convertDate(str(congeDate)) + timedelta(days=1)
        tabHoliday = Holiday.objects.values('start_date', 'end_date')
        for holiday in tabHoliday:
            holidayDate = convertDate(str(holiday['start_date']))
            while True:
                if holidayDate > convertDate(str(holiday['end_date'])):
                    break
                if convertDate(dateDeb) <= convertDate(str(holidayDate)) <= convertDate(dateFin):
                    dictEmp['jourFerie'] += 1
                else:
                    break
                holidayDate = convertDate(str(holidayDate)) + timedelta(days=1)
        result.append(dictEmp)
        dictEmp = {}

    return JsonResponse(list(result), safe=False, status=200)



@receiver(post_save, sender=User)
def create_default_overlap_period(sender, instance, created, **kwargs):
    if created:
        overlap_period_type, created = OverlapPeriodType.objects.get_or_create(name="Default")  # Assurez-vous d'avoir un type "Default" dans la table OverlapPeriodType
        days_of_week = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
        default_start_time = "08:00"
        default_end_time = "17:00"

        # Vérifiez si un OverlapPeriod par défaut existe déjà pour cet utilisateur
        existing_overlap_period = OverlapPeriod.objects.filter(user=instance, default=True).first()

        if not existing_overlap_period:
            
                overlap_period = OverlapPeriod(
                    start_date=None,
                    end_date=None,
                    delay=None,
                    default=True,
                    schedule_type=overlap_period_type,
                    department=None,
                    user=instance,
                )
                overlap_period.save()

                # Créez le ConfigurationDays associé
                for day in days_of_week:
                    configuration_day = ConfigurationDays(
                        weekday=day,
                        start_at=default_start_time,
                        end_at=default_end_time,
                        overlap_period=overlap_period,
                    )
                    configuration_day.save()
            
def save_users_from_device(request):
    try:
        zk = ZK('41.224.5.17', port=4370)
        first_device = Device.objects.first()
        if first_device:
            ip = first_device.ip
            port = first_device.port
        else:
            # Handle the case when there are no devices in the table
            return JsonResponse({'error': 'No devices found'}, status=400)
        
        # zk = ZK(ip, port=port)
        conn_status = zk.connect()
        result = []

        if conn_status:
            user_data = zk.get_users()
            print('get users--', user_data)

            department, _ = Department.objects.get_or_create(name="New")
            fonction, _ = Service.objects.get_or_create(name="employee")

            for data in user_data:
                print("User id--", data.user_id)

                user, created = Employee.objects.update_or_create(
                    matricule=data.user_id,
                    defaults={
                        "first_name": data.name,
                        "email": f"{data.user_id}@gmail.com",
                        "is_employee": True,
                        "department": department,  
                        "fonction": fonction,  
                        "password": "aftercode"
                    }
                )
                result.append(user)
                if created:
                    create_default_overlap_period(sender=User, instance=user, created=True)

            zk.disconnect()
            print("All users saved successfully!")
            print("All users", result)

            return JsonResponse({"message": "Users saved successfully"}, safe=False, status=200)

        else:
            return JsonResponse({"error": "Could not connect to the device."}, safe=False, status=500)
    except Exception as e:
        return JsonResponse({"error": str(e)}, safe=False, status=500)


def convertTime(strTime):
    h, m, s = [int(i) for i in strTime.split(':')]
    return timedelta(hours=h, minutes=m, seconds=s)


def convertDate(strDate):
    y, m, d = [int(i) for i in strDate.split('-')]
    return date(y, m, d)


def closest_time(target_time, time_list):
    return min(time_list, key=lambda x: abs((x.hour - target_time.hour) * 3600 + (x.minute - target_time.minute) * 60))


from django.http import HttpResponse

# def update_attendance_based_on_schedule():
#     # Obtenez tous les enregistrements d'assistance existants
#     attendances = Attendance.objects.all()

#     for attendance in attendances:
#         # Recherchez le planning correspondant à l'employé et à la date d'assistance
#         weekly_schedule = WeeklySchedule.objects.filter(
#             employee=attendance.user,
#             start_date_of_week__lte=attendance.date,
#             end_date_of_week__gte=attendance.date
#         ).first()

#         if weekly_schedule:
#             # Trouvez le jour de la semaine correspondant à la date d'assistance
#             day_of_week = attendance.date.strftime('%A')
#             day_schedule = DaySchedule.objects.filter(
#                 week_schedule=weekly_schedule,
#                 day__name=day_of_week
#             ).first()

#             if day_schedule:
#                 # Comparez l'heure d'arrivée d'assistance avec l'heure de check-in du planning
#                 if attendance.checkin < day_schedule.check_in:
#                     attendance.checkin = day_schedule.check_in
#                 # Comparez l'heure d'arrivée d'assistance avec l'heure de check-in du planning plus 5 minutes
#                 elif attendance.checkin > day_schedule.check_in + timedelta(minutes=5):
#                     # Ajoutez 1 heure à l'heure de check-in du planning
#                     new_checkin = day_schedule.check_in + timedelta(hours=1)
#                     # Mettez à jour l'heure d'arrivée d'assistance
#                     attendance.checkin = new_checkin

#                 # Sauvegardez la mise à jour
#                 attendance.save()


def update_attendance_based_on_schedule():
    attendances = Attendance.objects.all()
    updated_records = []
    duration = "00:00"
    additional_hours = "00:00"
    for attendance in attendances:
        # Recherchez le planning correspondant à l'employé et à la date d'assistance
        weekly_schedule = WeeklySchedule.objects.filter(
            employee=attendance.user,
            start_date_of_week__lte=attendance.date,
            end_date_of_week__gte=attendance.date
        ).first()

        if weekly_schedule:
            day_of_week = attendance.date.strftime('%A')
            day_schedule = DaySchedule.objects.filter(
                week_schedule=weekly_schedule,
                day__name=day_of_week
            ).first()

            if day_schedule:
                if attendance.checkin:
                    # Convertissez les datetime.time en datetime
                    checkin_datetime = datetime.combine(datetime.today(), attendance.checkin)
                    day_checkin_datetime = datetime.combine(datetime.today(), day_schedule.check_in)

                    if checkin_datetime < day_checkin_datetime:
                        # Mettez à jour checkin_datetime si nécessaire
                        checkin_datetime = day_checkin_datetime

                    if attendance.checkout and checkin_datetime:
                        checkout_datetime = datetime.combine(datetime.today(), attendance.checkout)

                        if checkout_datetime < checkin_datetime:
                            checkout_datetime += timedelta(days=1)

                        duration_timedelta = checkout_datetime - checkin_datetime
                        duration_hours = duration_timedelta.total_seconds() / 3600

                        if duration_hours > 8.0:
                            overtime_timedelta = duration_timedelta - timedelta(hours=8)
                            hours, remainder = divmod(overtime_timedelta.total_seconds(), 3600)
                            minutes = remainder / 60
                            duration = "08:00"
                            additional_hours = "{:02}:{:02}".format(int(hours), int(minutes))
                        else:
                            duration = "{:02}:{:02}".format(int(duration_hours), int((duration_hours % 1) * 60))
                            additional_hours = "00:00"
                    checkin = checkin_datetime.strftime('%H:%M') 
                    # Mettre à jour l'enregistrement d'assiduité
                    attendance.checkin = checkin
                    attendance.duration = duration
                    attendance.additional_hours = additional_hours
                    attendance.save()
                    updated_records.append({
                        "user": attendance.user.id,
                        "date":attendance.date,
                        "checkin": attendance.checkin,
                        "duration": duration,
                        "additional_hours": additional_hours
                    })
    return updated_records


def custom_serializer(obj):
    if isinstance(obj, (date, datetime)):
        return obj.isoformat()
    else:
        return None  # Renvoie None pour les types non sérialisables

def update_attendance_view(request):
    updated_records = update_attendance_based_on_schedule()
    
    response_data = {
        "message": "Mise à jour des présences effectuée avec succès",
        "updated_records": updated_records
    }
    
    response_json = json.dumps(response_data, default=custom_serializer, cls=DjangoJSONEncoder)
    
    return HttpResponse(response_json, content_type='application/json')
# def update_attendance_view(request):
#     update_attendance_based_on_schedule()
#     return HttpResponse("Mise à jour des présences effectuée avec succès")






@api_view(['POST'])
def update_attendance_ramathane(request):
    data = request.data
    start_date = datetime.strptime("01-04-2024", "%d-%m-%Y").date()
    end_date = datetime.strptime("09-04-2024", "%d-%m-%Y").date()
    attendances = Attendance.objects.filter(date__range=(start_date, end_date))
    
    for attendance in attendances:
        attendance.checkin = data.get('checkin', attendance.checkin)
        attendance.checkout_pause = data.get('checkout_pause', attendance.checkout_pause)
        attendance.checkin_pause = data.get('checkin_pause', attendance.checkin_pause)
        attendance.checkout = data.get('checkout', attendance.checkout)
        
        # Conversion des chaînes en objets time
        checkout_pause_time = datetime.strptime(attendance.checkout_pause, '%H:%M:%S').time()
        checkin_time = datetime.strptime(attendance.checkin, '%H:%M:%S').time()
        checkout_time = datetime.strptime(attendance.checkout, '%H:%M:%S').time()
        checkin_pause_time = datetime.strptime(attendance.checkin_pause, '%H:%M:%S').time()
        
        # Calcul de la durée de travail
        d1 = datetime.combine(datetime.today(), checkout_pause_time) - datetime.combine(datetime.today(), checkin_time)
        d2 = datetime.combine(datetime.today(), checkout_time) - datetime.combine(datetime.today(), checkin_pause_time)
        duration = d1 + d2
        duration_hours = duration.total_seconds() / 3600  # Conversion en heures
        attendance.duration = "{:02}:{:02}:{:02}".format(int(duration_hours), int(duration.seconds // 60 % 60), int(duration.seconds % 60))
        attendance.duration= "08:00"
        attendance.additional_hours = "00:00"
        # Calcul des heures supplémentaires
        if duration_hours > 8:
            additional_hours = duration_hours - 8
            attendance.additional_hours = 0
        
        attendance.save()
    
    return Response({"message": "Attendances updated successfully"})

from django.db.models import Q
from django.shortcuts import get_object_or_404

@api_view(['PUT'])
def update_attendance(request):
    start_date = datetime.strptime('01/04/2024', '%d/%m/%Y')
    end_date = datetime.strptime('09/04/2024', '%d/%m/%Y')
    employee_matricules = [7, 24]

    for matricule in employee_matricules:
        user = get_object_or_404(User, matricule=matricule)
        Attendance.objects.filter(
            user=user,
            date__range=(start_date, end_date)
        ).update(checkin='12:00')

    return Response({'message': 'Attendance updated successfully'})