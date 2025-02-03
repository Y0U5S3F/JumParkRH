from django.urls import path
from attendance import views, generate_pdf

urlpatterns = [
    # path("list-attendance", views.ListAttendances.as_view(), name='List-attendances'),
    path('list-attendance/', views.AttendanceList.as_view(), name='attendance-list'),

    path("list-attendance-department/", views.ListAttendancesByDepartment.as_view()),
    path("create-attendance", views.CreateAttendances.as_view()),
    path('update-attendance/<int:pk>/',views.UpdateAttendances.as_view(),name='UpdateAttendances'),
   
    path("save_users_from_device", views.save_users_from_device, name='save-users'),
    path("recap-monthly", views.monthly_recap, name='recap-monthly'),

    # get attendance valide
    path("import-attendances-all", views.get_attendance_data_all),
    path("import-attendances", views.get_attendance_data),
    path("import-attendances-retard", views.get_attendance_data_retard),
    path("delete/<int:pk>/", views.DeleteAttendanceAPIView.as_view(),
         name="attendance_delete"),
    
    path('generate-report/', generate_pdf.generate_report_and_send_email, name='generate_report'),
    path('generate-report-monthly/', generate_pdf.generate_attendance_report, name='generate_report-monthly'),
    path('generate-daily-report/', generate_pdf.generate_daily_report, name='generate_daily_report'),

    # path('update_attendance/', views.AttendanceUpdateRetardView.as_view({'post': 'update_attendance'}), name='update-attendance'),
    path('update_attendance/', views.update_attendance_view, name='update_attendance'),

]