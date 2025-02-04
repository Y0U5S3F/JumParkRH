from .views import get_attendance_data , save_users_from_device
from . generate_pdf import generate_report_and_send_email


def my_scheduled_job():
    response = get_attendance_data(request=None)

def my_scheduled_users():
    response = save_users_from_device(request=None)


def daily_report():
    response = generate_report_and_send_email(request=None)

