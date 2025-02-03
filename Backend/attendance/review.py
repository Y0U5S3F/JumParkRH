from django.shortcuts import render
from .models import Attendance
from rest_framework.generics import ListAPIView, CreateAPIView, DestroyAPIView, UpdateAPIView
from .serializers import AttendanceSerializer, CreateAttendanceSerializer
import datetime
# import pyzk.zklib
from zk.base import ZK, const
from django.http import HttpResponse
from authentication.models import Employee
import datetime
from datetime import datetime
from django.http import JsonResponse
from django.core.serializers.json import DjangoJSONEncoder
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
from device.models import Device
from setting.models import ConfigurationDays
from datetime import time
from django.utils import timezone
from django.db.models import Q
from django.core.serializers import serialize
from django.forms.models import model_to_dict
from django.core.cache import cache
from django.db import connection
from django.utils import timezone
from rest_framework.response import Response
from authentication.models import UserAccount

User = get_user_model()

class ListAttendances(ListAPIView):
    # queryset = Attendance.objects.all()
    serializer_class = AttendanceSerializer
    
    def get_queryset(self):
        queryset = Attendance.objects.all()
        queryset = queryset.filter(user__is_deleted=False)
        return queryset
 
class DeleteAttendanceAPIView(DestroyAPIView):
    """This endpoint allows for deletion of a specific Bank from the database"""
    queryset = Attendance.objects.all()
    serializer_class = AttendanceSerializer

   
class ListAttendancesBydepartment(ListAPIView):
    # queryset = Attendance.objects.all()
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

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)

        # Mise à jour des champs checkin et checkout
        new_checkin = serializer.validated_data.get('checkin')
        new_checkout = serializer.validated_data.get('checkout')

        # Mettez à jour les champs dans l'instance
        instance.checkin = new_checkin
        instance.checkout = new_checkout

        # Calcul de la durée
        if new_checkin and new_checkout:
            # Convertissez les heures en objets datetime
            checkin_datetime = datetime.combine(datetime.today(), new_checkin)
            checkout_datetime = datetime.combine(datetime.today(), new_checkout)
            
            # Si l'heure de checkout est antérieure à l'heure de checkin, cela signifie que
            # le checkout se produit le jour suivant.
            # Dans ce cas, ajustez la date de checkout d'un jour.
            if new_checkout < new_checkin:
                checkout_datetime += timedelta(days=1)
            
            # Calculez la durée
            duration_timedelta = checkout_datetime - checkin_datetime
            
            # Convertissez la durée en heures
            duration_hours = duration_timedelta.total_seconds() / 3600

            # Calcul des heures supplémentaires
            if duration_hours > 8.0:
                overtime_timedelta = duration_timedelta - timedelta(hours=8)
                hours, remainder = divmod(overtime_timedelta.total_seconds(), 3600)
                minutes = remainder / 60
                instance.duration = "08:00"  # Mettez à jour avec "08:00"
                instance.additional_hours = "{:02}:{:02}".format(int(hours), int(minutes))
            else:
                instance.duration = "{:02}:{:02}".format(int(duration_hours), int((duration_hours % 1) * 60))  # Format personnalisé pour les heures et les minutes
                instance.additional_hours = "00:00"


        # Enregistrez les modifications
        instance.save()

        return Response(serializer.data)







def get_attendance_from_device(request):
    zk = ZK('192.168.1.203', port=4370, timeout=5, password=0, force_udp=False, ommit_ping=False)
    conn_status = zk.connect()
    if conn_status:
        attendance_data = zk.get_attendance()
        zk.disconnect()
        for data in attendance_data:
            user_id = data.user_id
            if user_id:
                try:
                    user = User.objects.get(matricule=user_id)
                    print('user--', user)
                    print(datetime.__file__)

                    date_time = datetime.datetime.strptime(data.timestamp.strftime('%Y-%m-%d %H:%M:%S'), '%Y-%m-%d %H:%M:%S')
                    print('datetime-----', date_time)

                    attendance, created = Attendance.objects.get_or_create(
                        date=date_time.date(),
                        user=user
                    )
                    if created:
                        attendance.checkin = date_time.time()
                        attendance.save()
                    else:
                        if not attendance.checkin_pause:
                            attendance.checkin_pause = date_time.time()
                        elif not attendance.checkout_pause:
                            attendance.checkout_pause = date_time.time()
                        elif not attendance.checkout:
                            attendance.checkout = date_time.time()
                            duration = datetime.combine(date_time.date(), attendance.checkout) - datetime.combine(date_time.date(), attendance.checkin)
                            attendance.duration = duration.time()
                            attendance.status = 'Present'
                            attendance.save()
                        else:
                            # Attendance already marked as complete
                            pass
                except User.DoesNotExist:
                    # Handle the case where the user does not exist in the database
                    print(f"User with id={user_id} does not exist in the database.")
                except Exception as e:
                    # Handle other possible exceptions
                    print(f"An error occurred while processing attendance data for user_id={user_id}. Error message: {e}")
 

def get_attendance_from_devicee(request):
    zk = ZK('192.168.1.203', port=4370, timeout=5, password=0, force_udp=False, ommit_ping=False)
    conn_status = zk.connect()
    attendance_list = []
    if conn_status:
        attendance_data = zk.get_attendance()
        zk.disconnect()
        for data in attendance_data:
            user_id = data.user_id
            if user_id:
                try:
                    user = User.objects.get(matricule=user_id)
                    print('user--', user)
                    print(datetime.__file__)

                    date_time = datetime.datetime.strptime(data.timestamp.strftime('%Y-%m-%d %H:%M:%S'), '%Y-%m-%d %H:%M:%S')
                    print('datetime-----', date_time)

                    attendance, created = Attendance.objects.get_or_create(
                        date=date_time.date(),
                        user=user
                    )
                    if created:
                        attendance.checkin = date_time.time()
                        attendance.checkout = date_time.time()
                        attendance.save()
                    else:
                        if not attendance.checkin_pause:
                            attendance.checkin_pause = date_time.time()
                        elif not attendance.checkout_pause:
                            attendance.checkout_pause = date_time.time()
                        elif not attendance.checkout:
                            attendance.checkout = date_time.time()
                            duration = datetime.combine(date_time.date(), attendance.checkout) - datetime.combine(date_time.date(), attendance.checkin)
                            attendance.duration = duration.time()
                            attendance.status = 'Present'
                            attendance.save()
                        else:
                            # Attendance already marked as complete
                            pass

                    # Add attendance information to the list
                    attendance_dict = {
                        'id': attendance.id,
                        'date': attendance.date.strftime('%d/%m/%Y'),
                        'checkin': attendance.checkin.strftime('%H:%M') if attendance.checkin else None,
                        'checkout': attendance.checkout.strftime('%H:%M') if attendance.checkout else None,
                        'checkin_pause': attendance.checkin_pause.strftime('%H:%M') if attendance.checkin_pause else None,
                        'checkout_pause': attendance.checkout_pause.strftime('%H:%M') if attendance.checkout_pause else None,
                        'user': user.id,
                        # 'employee': user.get_full_name(),
                        'duration': attendance.duration.strftime('%H:%M') if attendance.duration else None,
                        'status': attendance.status
                    }
                    attendance_list.append(attendance_dict)

                except User.DoesNotExist:
                    # Handle the case where the user does not exist in the database
                    print(f"User with id={user_id} does not exist in the database.")
                except Exception as e:
                    # Handle other possible exceptions
                    print(f"An error occurred while processing attendance data for user_id={user_id}. Error message: {e}")

    return JsonResponse(attendance_list, safe=False, encoder=DjangoJSONEncoder)


# Attendance valide

def get_attendance_data(request):
    zk = ZK('192.168.1.203', port=4370)
    conn = zk.connect()
    # devices = Device.objects.all()
    # connections = []
    # for device in devices:
    #     zk = ZK(device.ip, port=int(device.port))
    #     conn = zk.connect()
    #     connections.append(conn)
    attendance_list = []
    error_list = []
    if conn:
        print("Connected to device")
        zk.disable_device()
        if zk.enable_device():
            print("Device is enabled")
            attendance_records = zk.get_attendance()
            print('zk---', attendance_records)
            
            users_id = zk.get_users()
            for user_id in users_id:
                    # Check if user exists in the device
                    if not User.objects.filter(matricule=user_id.user_id).exists():
                        data= {
                            "user":user_id.name,
                            "uid":user_id.uid,
                            "email":str(user_id.user_id)+"@gmail.com",
                        }
                        error_list.append(data)
                        # continue  # Skip the rest of the loop if user does not exist
    
                # check if there are any errors
            if error_list:
                    # if there are errors, return an HTTP response with the list of errors
                    # error_msg = '\n'.join(error_list)
                    # return HttpResponse(error_list, status=400)
                    return JsonResponse(error_list,  safe=False, status=400)
            for record in attendance_records:
                user_id =record.user_id
                
                user = UserAccount.objects.get(matricule=user_id)
                attendance_dict = {
                    "user": record.user_id,
                    "checkin": None,
                    "checkout": None,
                    "date": record.timestamp.strftime("%d-%m-%Y"),
                    "duration":None,
                    "additional_hours":None
                    
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
                                
            zk.enable_device()
        else:
            print("Unable to enable device")
        zk.disconnect()
    else:
        print("Unable to connect to device")
    return JsonResponse(attendance_list, safe=False)
    


@csrf_exempt
def get_attendance_dataa(request):
    
    zk = ZK('192.168.1.203', port=4370)
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
            for record in attendance_records:
                user_id =record.user_id
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

    # Mettre en cache les résultats
    # cache.set('attendance_list', attendance_list, timeout=1)  # Cache pendant 1 heure
    print('attendance_list--', attendance_list)
    return JsonResponse(attendance_list, safe=False)








# @csrf_exempt
# def get_attendance_dataa(request):
#     try:
#         # Initialize the connection to the ZK device
#         zk = ZK('192.168.1.203', port=4370)
#         conn = zk.connect()
#         attendance_list = []
#         error_list = []
#         cache_key = 'attendance_data'

#         # Check if attendance data is present in cache
#         cached_data = cache.get(cache_key)
#         if cached_data:
#             return JsonResponse(cached_data, safe=False)

#         if conn:
#             print("Connected to device")
#             zk.disable_device()

#             if zk.enable_device():
#                 print("Device is enabled")

#                 # Fetch attendance records from the device
#                 attendance_records = zk.get_attendance()
#                 print('zk---', attendance_records)

#                 # Fetch user IDs from the device
#                 users_id = zk.get_users()
#                 print('test user data---', users_id)

#                 for user_id in users_id:
#                     # Check if user exists in the device
#                     if not User.objects.filter(matricule=user_id.user_id).exists():
#                         data = {
#                             "user": user_id.name,
#                             "uid": user_id.user_id,
#                             "email": f"{user_id.user_id}@gmail.com",
#                         }
#                         error_list.append(data)
#                         continue

#                 # Filter attendance records for the current month and year
#                 current_month = timezone.now().month
#                 current_year = timezone.now().year
#                 attendance_records = [record for record in attendance_records if
#                                       record.timestamp.month == current_month and record.timestamp.year == current_year]

#                 for record in attendance_records:
#                     user_id = record.user_id
#                     # user = User.objects.get(matricule=user_id)
#                     try:
#                         user = User.objects.get(matricule=user_id)
#                     except User.DoesNotExist:
#                         # Handle the case where the UserAccount with the specified matricule does not exist
#                         user = None  # or perform other actions as needed

#                     attendance_dict = {
#                         "user": record.user_id,
#                         "checkin": None,
#                         "checkout": None,
#                         "date": record.timestamp.strftime("%d-%m-%Y"),
#                         "duration": None,
#                         "additional_hours": None
#                     }

#                     if record.punch == 0:
#                         attendance_dict["checkin"] = record.timestamp.strftime("%H:%M:%S")
#                     elif record.punch == 1:
#                         attendance_dict["checkout"] = record.timestamp.strftime("%H:%M:%S")

#                     # Calculate duration and additional hours
#                     checkin = attendance_dict["checkin"]
#                     checkout = attendance_dict["checkout"]

#                     if checkin and checkout:
#                         checkin = datetime.combine(datetime.today(), datetime.strptime(checkin, "%H:%M:%S").time())
#                         checkout = datetime.combine(datetime.today(), datetime.strptime(checkout, "%H:%M:%S").time())

#                         if checkin <= checkout:
#                             duration = checkout - checkin
#                         else:
#                             duration = timedelta(days=1) - (checkin - checkout)

#                         hours, remainder = divmod(duration.seconds, 3600)
#                         minutes, seconds = divmod(remainder, 60)
#                         duration_str = f"{hours:02d}:{minutes:02d}"

#                         if duration_str:
#                             if duration_str > "08:00":
#                                 additional_hours_duration = datetime.strptime(duration_str, "%H:%M") - datetime.strptime(
#                                     "08:00", "%H:%M")
#                                 additional_hours = str(additional_hours_duration)
#                             else:
#                                 additional_hours = "00:00"
#                         else:
#                             duration_str = "00:00"
#                             additional_hours = "00:00"

#                     else:
#                         duration_str = "00:00"
#                         additional_hours = "00:00"

#                     Attendance.objects.update_or_create(
#                         user=user,
#                         date=datetime.combine(record.timestamp.date(), datetime.min.time()),
#                         defaults={
#                             'checkin': checkin,
#                             'checkout': checkout,
#                             'duration': duration_str,
#                             'additional_hours': additional_hours
#                         }
#                     )
#                     attendance_list.append(attendance_dict)

#                 if error_list:
#                     return JsonResponse(error_list, safe=False, status=400)

#                 # Cache the attendance data for future use
#                 cache.set(cache_key, attendance_list)

#                 zk.enable_device()
#             else:
#                 print("Unable to enable device")

#             zk.disconnect()
#         else:
#             print("Unable to connect to device")

#         print('attendance_list--', attendance_list)
#         return JsonResponse(attendance_list, safe=False)
#     except Exception as e:
#         return JsonResponse({"error": str(e)}, safe=False, status=500)



@csrf_exempt
def recapMensuel(request):
    # data = json.loads(request.body)
    # print('data', data)
    # selectedDept = data['selectedDept']
    # dateDeb = data['dateDeb']
    # dateFin = data['dateFin']
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

        # loop attentence if selected employee
        empHeureSupplimentaire = 0
        empHeure = 0
        dictEmp = {
            'id': empID['matricule'],
            'matricule': empID['matricule'],
            'full_name': empID['first_name'],
            'nbHeureTrav': 0, # initialize here
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
        # Check if total number of days worked exceeds 26
        total_days = dictEmp['nbJourTrav'] + dictEmp['nbJourSup']
        if total_days > 26:
            total_days = total_days - 26
            dictEmp['nbJourTrav'] = 26
            dictEmp['nbJourSup'] = total_days
        else:
            dictEmp['nbJourTrav'] = total_days
            dictEmp['nbJourSup'] = 0
            
            # if dictEmp['nbJourSup'] != 0:
            #     total_days = min(total_days, 26)  # Set the total to 26 if it exceeds
            # dictEmp['nbJourTrav'] = min(dictEmp['nbJourTrav'], total_days)
            # dictEmp['nbJourSup'] = max(total_days - dictEmp['nbJourTrav'], 0)
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
        # print('result----', result)
        # print('dictEmp', dictEmp)
    return JsonResponse(list(result), safe=False, status=200)



def save_users_from_device(request):
    try:
        # Connect to the device
        zk = ZK('192.168.1.203', port=4370)
        conn_status = zk.connect()
        result = []

        if conn_status:
            # Get all users from the device
            user_data = zk.get_users()
            print('get users--', user_data)

            # Get the 'New' department or create it if it doesn't exist
            department, _ = Department.objects.get_or_create(name="New")
            fonction, _ = Service.objects.get_or_create(name="employee")

            for data in user_data:
                # Create an Employee object for each user in the device and assign them to the 'New' department
                print("User id--", data.user_id)

                user, created = Employee.objects.get_or_create(
                    matricule=data.user_id,
                    defaults={
                        "first_name": data.name,
                        "email": f"{data.user_id}@gmail.com",
                        "is_employee": True,
                        "department": department,  # Assign to the 'New' department
                        "fonction": fonction,  # Assign to the 'New' department
                        "password": "aftercode"
                    }
                )
                result.append(user)

            zk.disconnect()
            print("All users saved successfully!")
            print("All users", result)

            return JsonResponse({"message": "Users saved successfully"}, safe=False, status=200)

        else:
            return JsonResponse({"error": "Could not connect to the device."}, safe=False, status=500)
    except Exception as e:
        return JsonResponse({"error": str(e)}, safe=False, status=500)

# except Exception as e:
#     # Handle any exceptions that occurred during the process
#     return JsonResponse({'error': str(e)}, status=500)

    
    
    
    
#  # Check if user exists in the device
#                 if not User.objects.filter(matricule=user_id).exists():
#                     error_list.append(f"User with ID {user_id} does not exist in the device")
#                     continue  # Skip the rest of the loop if user does not exist



# def getUsers(request):
#     """
#     department
#     service
#     matricule
#     UID
#     GID
#     user_id
#     is_fingerprint_present
#     fingerprint_data :optional:
#     nom
#     prenom
#     cin
#     date_nais
#     lieuN
#     nationalite
#     genre
#     situationFamilial
#     natureCon
#     typeSalaire=
#     email
#     tel
#     nbrH
#     dateEmbauch
#     salairBrut
#     """
#     if request.method == "POST":
#         ip = request.POST['ip']
#         port = request.POST['port']
#         if validateinput(ip, port):
#             conn = test_conn(ip, port)
#             if not conn:
#                 return HttpResponse(json.dumps({"code": 0, "state:": "Problem Getting Users"}), content_type='application/json', status=404)
#             else:
#                 conn = startconn(ip, port)
#                 users = conn.get_users()
#                 all = '{"code":1,"results":['
#                 for user in users:
#                     users = employee(nom=user.name, UID=user.user_id, user_id=user.user_id,
#                                      is_fingerprint_present=True, matricule=user.user_id, email=str(user.user_id)+"@default.tld")
#                     users.save()
#                     all = all+'{"name":'+user.name+',"password":'+user.password + \
#                         ',"GID":'+user.group_id+',"UID":' + user.user_id+"},"
#                 all = all[:-1]+"]}"
#                 ############################
#                 # allc=str(all) +str({"name":user.name,"password": user.password,"GID":user.group_id,"UID": user.user_id})
#                 return HttpResponse(all, content_type='application/json')
#         else:
#             return HttpResponse(json.dumps({"code": 0, "state:": "Please Check Your Input"}), content_type='application/json', status=400)
#     elif request.method == "OPTIONS":
#         return HttpResponse(json.dumps({"code": 1, "state:": "POST,OPTIONS"}), content_type='application/json')
#     else:
#         return HttpResponse(json.dumps({"code": 0, "state:": "Only POST ,OPTIONS requests are allowed"}), content_type='application/json', status=503)



def convertTime(strTime):
    h, m, s = [int(i) for i in strTime.split(':')]
    return timedelta(hours=h, minutes=m, seconds=s)


def convertDate(strDate):
    y, m, d = [int(i) for i in strDate.split('-')]
    return date(y, m, d)


# # récap mensuelle
import json

# @csrf_exempt
# def recapMensuel(request):
#     try:
#         data = json.loads(request.body)
#         selectedDept = data['selectedDept']
#         dateDeb = data['dateDeb']
#         dateFin = data['dateFin']

#     except:
#         return JsonResponse(['ERROR'], safe=False)

#     empsID = Employee.objects.filter(department_id=selectedDept).values(
#         'id', 'matricule', 'first_name', 'last_name', 'fonction_id')
    
#     dept = Department.objects.filter(id=selectedDept).values_list('name', 'id')
#     name_department, id_department = dept[0] if dept else (None, None)
    
#     result = []

#     for empID in empsID:
#         empService = Service.objects.filter(
#             id=empID['fonction_id']).values_list('name', flat=True)

#         # Initialize employee statistics
#         dictEmp = {
#             'id': empID['matricule'],
#             'matricule': empID['matricule'],
#             'full_name': empID['first_name'],
#             'nbHeureTrav': 0,
#             'nbJourTrav': 0,
#             'nbJourSup': 0,
#             'HeureSupplimentaire': 0,
#             'conge': 0,
#             'absence': 0,
#             'autorisation': 0,
#             'jourFerie': 0,
#             'service': empService[0],
#             'department': name_department,
#             'department_id': id_department,
#         }

#         # Retrieve attendances for the selected employee
#         listAttendancesOfSelectedEmp = Attendance.objects.filter(
#             user__is_deleted=False, user_id=empID['id']).values(
#             'duration', 'additional_hours', 'date', 'checkin', 'checkout')

#         for attendance in listAttendancesOfSelectedEmp:
#             duration_str = attendance['duration']
#             additional_hours_str = attendance['additional_hours']
#             checkin = attendance['checkin']
#             checkout = attendance['checkout']

#             # Vérifier que checkin est inférieur à checkout
#             if checkin and checkout and checkin < checkout:
#                 # Calculate overtime and workdays
#                 duration_time = datetime.strptime(duration_str, '%H:%M').time()
#                 duration_hours, _ = divmod(duration_time.hour * 3600 + duration_time.minute * 60, 3600)
#                 additional_hours_time = datetime.strptime(additional_hours_str, '%H:%M').time()
#                 additional_hours_hours, _ = divmod(additional_hours_time.hour * 3600 + additional_hours_time.minute * 60, 3600)

#                 work_hours = duration_hours + additional_hours_hours
#                 overtime_hours = max(work_hours - 8, 0)
#                 overtime_minutes = (work_hours - 8) * 60
#                 workdays = work_hours / 8

#                 dictEmp['nbHeureTrav'] += work_hours
#                 dictEmp['nbJourTrav'] += workdays
#                 dictEmp['nbJourSup'] += overtime_hours
#                 dictEmp['HeureSupplimentaire'] += overtime_minutes

#         # ... (Calculations for absence, holiday, etc.)

#         result.append(dictEmp)

#     return JsonResponse(list(result), safe=False, status=200)







# from rest_framework.views import APIView
# from rest_framework.response import Response
# from rest_framework import status
# from datetime import datetime, time, timedelta
# from django.db.models import Avg
# from django.utils import timezone

# @csrf_exempt
# def update_missing_checkouts(request):
#     # Get the current month and year
#     today = datetime.today()
#     current_month = today.month
#     current_year = today.year
    
#     # Find attendance entries with missing check-in and check-out
#     attendances = Attendance.objects.filter(checkin__isnull=True, checkout__isnull=True, date__month=current_month, date__year=current_year)
    
#     for attendance in attendances:
#         # Find the last checkout of the month for the user
#         last_checkout = Attendance.objects.filter(user=attendance.user, date__month=current_month, date__year=current_year, checkout__isnull=False).last()
        
#         if last_checkout:
#             print('test----', last_checkout)
#             checkout_time = last_checkout.checkout + timedelta(hours=8)  # Assuming 8 hours workday
#             attendance.checkout = checkout_time
#             attendance.status = 'Present'  # Set the appropriate status
#             attendance.save()
    
#     return JsonResponse({'message': 'Missing check-outs updated.'})

# @csrf_exempt
# def remplir_checkout_manquants():
#     attendances = Attendance.objects.all().order_by('date')  # Récupérer les entrées d'attendance triées par date

#     for i in range(1, len(attendances)):
#         if attendances[i].checkin is not None and attendances[i].checkout is None:
#             previous_checkin = attendances[i - 1].checkin
#             if previous_checkin is not None:
#                 previous_checkin_time = datetime.combine(attendances[i].date, previous_checkin)
#                 attendances[i].checkout = previous_checkin_time.time()
#                 attendances[i].save()

# def remplir_checkout_api(request):
#     remplir_checkout_manquants()
#     return Response({"message": "Horaires de check-out manquants remplis avec succès."})



# def update_checkout_from_previous_days(request):
#     target_checkout_time = time(23, 30)  # Heure cible pour le checkout

#     attendances = Attendance.objects.all().order_by('-date')  # Tri décroissant par date
#     for index, attendance in enumerate(attendances):
#         if attendance.checkout is None and attendance.checkin is not None:
#             attendance.checkout = target_checkout_time
#             attendance.save(update_fields=['checkout'])

#         if attendance.checkin is None and attendance.checkout is not None:
#             attendance.delete()  # Suppression de l'entrée

#     return HttpResponse("Mise à jour des checkouts et suppression effectuées avec succès.")


# def calculate_approximate_checkout(previous_checkouts, current_day_checkout):
#     if not previous_checkouts:
#         return current_day_checkout

#     total_checkouts = len(previous_checkouts)
#     total_checkout_seconds = sum(
#         (checkout.hour * 3600 + checkout.minute * 60) for checkout in previous_checkouts
#     )

#     average_checkout_seconds = (total_checkout_seconds + current_day_checkout.hour * 3600 + current_day_checkout.minute * 60) // (total_checkouts + 1)
#     average_checkout = time(
#         hour=average_checkout_seconds // 3600,
#         minute=(average_checkout_seconds % 3600) // 60
#     )
#     return average_checkout



def closest_time(target_time, time_list):
    return min(time_list, key=lambda x: abs((x.hour - target_time.hour) * 3600 + (x.minute - target_time.minute) * 60))

# def update_checkout_from_previous_days(request):
#     # Set the current month to August
#     current_month = datetime(year=timezone.now().year, month=8, day=1).date()
#     print('month-current_month-', current_month)

#     users = User.objects.all()

#     for user in users:
#         # Supprimer les enregistrements de "checkout" sans enregistrement de "checkin"
#         Attendance.objects.filter(
#             date__month=current_month.month,
#             checkout__isnull=False,
#             checkin__isnull=True,
#             user=user
#         ).delete()

#         # Récupérer les enregistrements d'assiduité du mois en cours pour l'utilisateur avec une heure de départ non nulle
#         today = timezone.now().date()
#         previous_checkouts = Attendance.objects.filter(
#             Q(date__lt=today) & Q(date__month=current_month.month) & Q(checkout__isnull=False) & Q(user=user)
#         ).values_list('checkout', flat=True)

#         current_day_checkouts = Attendance.objects.filter(
#             date=today,
#             checkout__isnull=False,
#             user=user
#         ).values_list('checkout', flat=True)

#         target_times = list(current_day_checkouts) + list(previous_checkouts)

#         if target_times:
#             target_checkout_time = closest_time(target_time=time(0, 5), time_list=target_times)
#         else:
#             target_checkout_time = time(23, 30)  # Heure cible pour le checkout

#         # Mettre à jour les checkouts pour les jours du mois en cours et l'utilisateur en cours
#         attendances = Attendance.objects.filter(
#             date__month=current_month.month,
#             checkout__isnull=True,
#             checkin__isnull=False,
#             user=user
#         )
#         for attendance in attendances:
#             attendance.checkout = target_checkout_time
#             attendance.save(update_fields=['checkout'])

#     return HttpResponse("Mise à jour des checkouts effectuée avec succès.")


# def update_checkout_from_previous_days(request):
#     # Set the current month to August
#     current_month = datetime(year=timezone.now().year, month=8, day=1).date()
#     print('month-current_month-', current_month)

#     users = User.objects.all()

#     for user in users:
#         # Supprimer les enregistrements de "checkout" sans enregistrement de "checkin"
#         Attendance.objects.filter(
#             date__month=current_month.month,
#             checkout__isnull=False,
#             checkin__isnull=True,
#             user=user
#         ).delete()

#         # Récupérer les enregistrements d'assiduité du mois en cours pour l'utilisateur avec une heure de départ non nulle
#         today = timezone.now().date()
#         previous_checkouts = Attendance.objects.filter(
#             Q(date__lt=today) & Q(date__month=current_month.month) & Q(checkout__isnull=False) & Q(user=user)
#         ).values_list('checkout', flat=True)

#         current_day_checkouts = Attendance.objects.filter(
#             date=today,
#             checkout__isnull=False,
#             user=user
#         ).values_list('checkout', flat=True)

#         target_times = list(current_day_checkouts) + list(previous_checkouts)

#         if target_times:
#             target_checkout_time = closest_time(target_time=time(0, 5), time_list=target_times)
#         else:
#             target_checkout_time = time(23, 30)  # Heure cible pour le checkout

#         # Mettre à jour les checkouts pour les jours du mois en cours et l'utilisateur en cours
#         attendances = Attendance.objects.filter(
#             date__month=current_month.month,
#             checkout__isnull=True,
#             checkin__isnull=False,
#             user=user
#         )
#         for attendance in attendances:
#             attendance.checkout = target_checkout_time

#             # Calcul de la durée de travail et des heures supplémentaires
#             checkin_datetime = datetime.combine(attendance.date, attendance.checkin)
#             checkout_datetime = datetime.combine(attendance.date, attendance.checkout)

#             if checkin_datetime <= checkout_datetime:
#                 duration = checkout_datetime - checkin_datetime
#             else:
#                 duration = timedelta(days=1) - (checkin_datetime - checkout_datetime)

#             hours, remainder = divmod(duration.seconds, 3600)
#             minutes, _ = divmod(remainder, 60)
#             attendance.duration = f"{hours:02d}:{minutes:02d}"

#             if duration.total_seconds() > 8 * 3600:
#                 additional_hours_duration = duration - timedelta(hours=8)
#                 hours, remainder = divmod(additional_hours_duration.seconds, 3600)
#                 minutes, _ = divmod(remainder, 60)
#                 attendance.additional_hours = f"{hours:02d}:{minutes:02d}"
#             else:
#                 attendance.additional_hours = "00:00"

#             attendance.save(update_fields=['checkout', 'duration', 'additional_hours'])

#     return HttpResponse("Mise à jour des checkouts effectuée avec succès.")

# from django.forms.models import model_to_dict

# @csrf_exempt
# def retard(request):
#     attendances = Attendance.objects.all()
#     days = ConfigurationDays.objects.filter(id=1)
#     retards = []  # Create an empty list to store Delay objects
#     for attendance in attendances:
#         if attendance.checkin: 
#             for day in days:
#                 retard = day.overlap_period.delay
#                 sum_checkin = datetime.combine(datetime.now().date(), day.start_at) + timedelta(hours=retard.hour, minutes=retard.minute, seconds=retard.second)
#                 sum_checkin = sum_checkin.time()
#                 print('sum duration ---', sum_checkin)
#                 if attendance.checkin >  sum_checkin:
#                     checkin_datetime = datetime.combine(datetime.now().date(), attendance.checkin)
#                     sum_checkin_datetime = datetime.combine(datetime.now().date(), sum_checkin)
#                     retard_duration = checkin_datetime - sum_checkin_datetime
#                     retard_duration_seconds = retard_duration.total_seconds()
#                     retard_duration_str = str(timedelta(seconds=retard_duration_seconds))  # Convert to HH:MM:SS format

#                     retard = Delay(
#                     employee=attendance.user,
#                     duration=retard_duration_str,
#                 )
#                     retard.save()
#                     retards.append(model_to_dict(retard))# Serialize the Delay object to a dictionary
#                 else:
#                     # Perform actions for the else clause
#                     pass  # Replace this line with the desired code
#         else:
#             pass
            
#     return JsonResponse(list(retards), safe=False, status=200)

