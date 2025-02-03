from django.http import HttpResponse
from django.core.mail import EmailMessage
from datetime import date
from io import BytesIO
from .models import Attendance 
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import Paragraph
from reportlab.platypus import Spacer
from reportlab.lib.styles import getSampleStyleSheet
from django.http import HttpResponse
from django.core.mail import EmailMessage
from io import BytesIO
from django.utils import timezone
from django.db import models

from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet
from io import BytesIO
from datetime import date
from reportlab.lib import colors

# Function to generate the PDF report
def generate_pdf(presence_data,anomalie_data, absence_data):
    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter)
    elements = []
    today = date.today()

    # Title of the PDF
    title = f"Daily Attendance Status Jumpark Report {today.strftime('%Y-%m-%d')}"
    # title = "Daily Attendance Status Report"
    styles = getSampleStyleSheet()
    title_text = Paragraph("<b>%s</b>" % title, styles["Title"])
    elements.append(title_text)

    # Presence
    if presence_data:
        elements.append(Spacer(1, 20))
        elements.append(Paragraph("<u>Presence</u>", styles["Heading1"]))
        presence_table = create_employee_table(presence_data)
        elements.append(presence_table)


    if anomalie_data:
        elements.append(Spacer(1, 20)) 
        elements.append(Paragraph("<u>Anomalie</u>", styles["Heading1"]))
        anomalie_table = create_employee_table(anomalie_data)
        elements.append(anomalie_table)
        
    # Absence
    if absence_data:
        elements.append(Spacer(1, 20)) 
        elements.append(Paragraph("<u>Absence</u>", styles["Heading1"]))
        absence_table = create_employee_table(absence_data)
        elements.append(absence_table)    

        
    doc.build(elements)
    buffer.seek(0)
    return buffer


# Function to send the email with the PDF report
def send_email_with_pdf(pdf_buffer, manager_email):
    today = date.today()
    # subject = "Daily Attendance Status Report"
    subject = f"Daily Attendance Status Report - {today.strftime('%Y-%m-%d')}"
    message = "Please find attached the daily attendance status report Jumpark."
    from_email = settings.DEFAULT_FROM_EMAIL
    to_email = manager_email

    try:
        email = EmailMessage(subject, message, from_email, [to_email])
        email.attach("daily_attendance_status_report.pdf", pdf_buffer.getvalue(), "application/pdf")
        email.send()
        return True  
    except Exception as e:
        return str(e)  



def create_employee_table(employees):
    table_data =[["Nom", "Email", "Check-in", "Check-out"]]
    for employee in employees:
        table_data.append([employee["name"], employee["email"], employee["checkin"], employee["checkout"]])

    table_style = TableStyle(
        [
            ("BACKGROUND", (0, 0), (-1, 0), colors.grey),
            ("TEXTCOLOR", (0, 0), (-1, 0), colors.whitesmoke),
            ("ALIGN", (0, 0), (-1, -1), "CENTER"),
            ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
            ("BOTTOMPADDING", (0, 0), (-1, 0), 12),
            ("BACKGROUND", (0, 1), (-1, -1), colors.beige),
            ("GRID", (0, 0), (-1, -1), 1, colors.black),
        ]
    )

    table = Table(table_data)
    table.setStyle(table_style)
    return table
# Function to generate the report and send the email
def generate_report_and_send_email(request):
    # Get today's date
    today = date.today()
    attendance_records = Attendance.objects.filter(date=today)

    presence_data = []
    absence_data = []
    anomalie_data = []

    for record in attendance_records:
        if record.get_status == 'Present':
            presence_data.append({
                'name': record.user.full_name if record.user else "N/A",
                'email': record.user.email if record.user else "N/A",
                'checkin': record.checkin.strftime("%H:%M") if record.checkin else "N/A",
                'checkout': record.checkout.strftime("%H:%M") if record.checkout else "N/A",
            
            })
        elif record.get_status == 'Anomalie':
            anomalie_data.append({
                'name': record.user.full_name if record.user else "N/A",
                'email': record.user.email if record.user else "N/A",
                'checkin': record.checkin.strftime("%H:%M") if record.checkin else "N/A",
                'checkout': record.checkout.strftime("%H:%M") if record.checkout else "N/A",
            })
        elif record.get_status == 'Absent':
            absence_data.append({
                'name': record.user.full_name if record.user else "N/A",
                'email': record.user.email if record.user else "N/A",
                'checkin': record.checkin.strftime("%H:%M") if record.checkin else "N/A",
                'checkout': record.checkout.strftime("%H:%M") if record.checkout else "N/A",
        
            }) 

    # Generate the PDF
    pdf_buffer = generate_pdf(presence_data,anomalie_data, absence_data )
    
    manager_emails = ["bouaoud.aness98@gmail.com","Contact@bsconfection.com" ]



    # manager_email = "bouaoud.aness98@gmail.com"
    # result = send_email_with_pdf(pdf_buffer, manager_email)
    for manager_email in manager_emails:
            result = send_email_with_pdf(pdf_buffer, manager_email)

    if result is True:
        return HttpResponse("Report generated and sent successfully.")
    else:
        return HttpResponse(f"Failed to send the report: {result}")

def get_employees_by_status(status):
    desired_status = 'Present' 

    all_attendance = Attendance.objects.all()

    filtered_attendance = [attendance for attendance in all_attendance if attendance.get_status() == desired_status]
    print('test filter--',filtered_attendance)
    attendance_records = Attendance.objects.filter(status=status)
    employees_data = []

    for record in attendance_records:
        employee = {
            'name': record.user.full_name if record.user else "N/A",  
            'email': record.user.email if record.user else "N/A",
        }
        employees_data.append(employee)

    return employees_data
    

def generate_daily_report(request):
    today = timezone.now().date()

    start_of_day = timezone.make_aware(timezone.datetime(today.year, today.month, today.day, 0, 0, 0))
    end_of_day = timezone.make_aware(timezone.datetime(today.year, today.month, today.day, 23, 59, 59))

    status_counts = Attendance.objects.filter(date__range=[start_of_day, end_of_day]) \
        .values('status') \
        .annotate(count=models.Count('status')) \
        .order_by('status')

    status_data = {status['status']: status['count'] for status in status_counts}

    pdf_buffer = generate_pdf(status_data)

    manager_email = "bouaoud.aness98@gmail.com"
    subject = f"Daily Attendance Status Report - {today.strftime('%Y-%m-%d')}"
    message = "Please find attached the daily attendance status report."
    from_email = "bouaoud.aness15@gmail.com"  
    email = EmailMessage(subject, message, from_email, [manager_email])
    email.attach("daily_attendance_status_report.pdf", pdf_buffer.getvalue(), "application/pdf")
    email.send()

    return HttpResponse("Daily attendance status report generated and sent successfully.")


# -----------------Monthly report----a verifier(test)------------------

from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, PageTemplate, Frame, Paragraph
from reportlab.lib import colors
from reportlab.platypus.flowables import PageBreak
from django.core.mail import EmailMessage
from django.conf import settings
from datetime import datetime, timedelta
import io
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.colors import red
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import Paragraph, Spacer

styles = getSampleStyleSheet()


def generate_attendance_pdf_last_month():
    today = datetime.today()
    first_day_of_this_month = today.replace(day=1)
    last_day_of_last_month = first_day_of_this_month - timedelta(days=1)
    first_day_of_last_month = last_day_of_last_month.replace(day=1)

    attendances_to_include = Attendance.objects.filter(date__gte=first_day_of_last_month, date__lte=last_day_of_last_month).order_by('date')

    buffer = io.BytesIO()
    # doc = SimpleDocTemplate(buffer, pagesize=letter)
    doc = SimpleDocTemplate(buffer, pagesize=letter, title='Attendance Report - Last Month Jumpark')

    styles = getSampleStyleSheet()
    style_table = TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
    ])
    style_body = TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.white),
        ('GRID', (0, 0), (-1, -1), 1, colors.grey),
    ])
    style_red = ParagraphStyle(
        'RedText',
        parent=styles['Normal'],
        textColor='red',
    )
    # Data rows for the table
    data_rows = []
    for attendance in attendances_to_include:
        row = [
            str(attendance.date),
            str(attendance.user.id),
            attendance.user.first_name,
            str(attendance.checkin) if attendance.checkin else '<font color=red>N/A</font>',
            str(attendance.checkout_pause) ,
            str(attendance.checkin_pause) ,
            str(attendance.checkout) if attendance.checkout else '<font color=red>N/A</font>',
            attendance.get_status
        ]        
        if attendance.get_status == 'Anomalie':
            row = [Paragraph(item, style_red) if isinstance(item, str) else item for item in row]
        data_rows.append(row)

    table_header = ['Date', 'No', 'Prénom', 'Checkin','checkout_pause','checkin_pause', 'Checkout','Statut']

    table_data = [table_header] + data_rows
    table = Table(table_data)
    table.setStyle(style_body)

    frame = doc.pagesize[0] - doc.leftMargin - doc.rightMargin
    frame_height = doc.pagesize[1] - doc.topMargin - doc.bottomMargin
    frame_table = Table(data_rows, colWidths=[doc.width / len(table_data[0])]*len(table_data[0]))
    frame_table.setStyle(style_body)
    template = PageTemplate(id='all', frames=[Frame(doc.leftMargin, doc.bottomMargin, frame, frame_height)])

    doc.addPageTemplates([template])

    content = [table, PageBreak()]

    # Titre du document
    title = "Attendance Report - Last Month Jumpark"
    title_style = ParagraphStyle(name='Title', fontSize=16, alignment=1)

    # Ajouter le titre au contenu du document
    content.append(Paragraph(title, title_style))
    content.append(Spacer(1, 12))  # Ajouter un espacement entre le titre et le tableau

    # Ajouter le tableau au contenu du document
    content.append(table)

    doc.build(content)
    first_day_of_last_month = first_day_of_last_month.strftime('%Y-%m-%d')
    last_day_of_last_month = last_day_of_last_month.strftime('%Y-%m-%d')
    subject = 'Attendance Report - Last Month Jumpark'
    body = f'Please find the attached attendance report for the period {first_day_of_last_month} ---> {last_day_of_last_month}.'
    from_email = settings.DEFAULT_FROM_EMAIL
    to_email = 'bouaoud.aness98@gmail.com' 

    email = EmailMessage(subject, body, from_email, [to_email])

    # Attach the PDF file
    buffer.seek(0)
    email.attach('attendance_report_last_month.pdf', buffer.read(), 'application/pdf')

    email.send()

def generate_attendance_report(request):
    generate_attendance_pdf_last_month()
    return HttpResponse("Attendance report generated and sent successfully!")