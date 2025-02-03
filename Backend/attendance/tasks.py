# from .views import get_attendance_data_all  # Remove this import
from celery import shared_task

@shared_task(name="celery_get_attendance_data_all")
def celery_get_attendance_data_all():
    get_attendance_data_all()