from django.shortcuts import render
from .models import CronError
from attendance.views import get_attendance_data , save_users_from_device
from attendance.generate_pdf import generate_report_and_send_email
from django.core.mail import send_mail
import time
from datetime import timedelta


def my_scheduled_job():
    start_time = time.time() 
    try:
        response = get_attendance_data(request=None)
        end_time = time.time() 
        duration_seconds = end_time - start_time
        duration = timedelta(seconds=duration_seconds)
        
        CronError.objects.create(cron_type=f"my_scheduled_job",
                                 duration=duration,  
                                 error_message=response,
                                 is_resolved=True, 
                                 status=True)
    except Exception as e:
        end_time = time.time()
        error_message = str(e)
        error_messagee = f"Erreur dans my_scheduled_job. \n Statut de la réponse : {response.status_code}\n{str(e)}"
        # print('error_messagee--', error_messagee)
        CronError.objects.create(cron_type="my_scheduled_job",error_message=error_message)
        # send_mail(
        #     'Erreur dans my_scheduled_job',
        #     error_message,
        #     'bouaoud.aness15@gmail.com',
        #     ['bouaoud.aness98@gmail.com'],
        #     fail_silently=False,
        #     )
        
# def my_scheduled_joob():
#     start_time = time.time()
#     try:
#         response = get_attendance_data(request=None)
#     except Exception as e:
#         end_time = time.time()  # Enregistrez l'heure de fin
#         duration = end_time - start_time  # Calculez la durée
#         error_message = f"Erreur dans my_scheduled_job. Durée : {duration} secondes\nStatut de la réponse : {response.status_code}\n{str(e)}"
#         CronError.objects.create(cron_type="my_scheduled_job", error_message=error_message)
#         send_mail(
#             'Erreur dans my_scheduled_job',
#             error_message,
#             'your-email@example.com',  # Adresse d'envoi
#             ['manager1@example.com', 'manager2@example.com'],  # Liste des adresses de gestionnaires
#             fail_silently=False,
#         )
        
def my_scheduled_users():
    start_time = time.time()
    try:
        response = save_users_from_device(request=None)
        end_time = time.time() 
        duration_seconds = end_time - start_time
        duration = timedelta(seconds=duration_seconds)

        CronError.objects.create(
            cron_type="my_scheduled_users",
            error_message=response,  
            is_resolved=True,
            status=True,  
            duration=duration,  
        )

    except Exception as e:
        error_message = str(e)
        CronError.objects.create(cron_type="my_scheduled_users", error_message=error_message)

        # Envoyez un e-mail indiquant la fin de la tâche
        send_mail(
            'error my_scheduled_users',
            error_message,
            f'La tâche my_scheduled_users est terminée. Durée : {duration} secondes',
            'bouaoud.aness15@gmail.com',
            ['bouaoud.aness98@gmail.com'],
        )

def daily_report():
    try:
        response = generate_report_and_send_email(request=None)
        CronError.objects.create(cron_type="daily_report", error_message=response,is_resolved=True, status=True)

    except Exception as e:
        error_message = str(e)
        CronError.objects.create(cron_type="daily_report", error_message=error_message)
        
        
        
        
