from django.urls import path
from department import views
from setting import views

urlpatterns = [
    path("schedules", views.ListSchedule.as_view()),
    path("days_configurations", views.ListDay.as_view()),
    path('days_configurations/<int:department_id>/', views.ListDayFlexible.as_view(), name='list_day'),
    path("periods_configurations", views.ListConfigurationPeriod.as_view()),
    path('update_days/', views.update_configuration_days, name='update_configuration_days'),  
    # path('list-day/<int:user_id>', views.ListDayByUserId.as_view(), name='list-day-by-id'),
    path('list-day/<int:user_id>', views.ListDayByUserId.as_view(), name='list-day-by-user-id'),
    
    
    
    
    path('weekly-schedules/', views.WeeklyScheduleListCreateView.as_view(), name='weekly-schedule-list'),
    path('weekly-schedules/<int:pk>/',views.WeeklyScheduleDetailView.as_view(), name='weekly-schedule-detail'),
    path('day-schedules/', views.DayScheduleListCreateView.as_view(), name='day-schedule-list'),
    path('day-schedules/<int:pk>/', views.DayScheduleDetailView.as_view(), name='day-schedule-detail'),
    
    path('weekly-schedules-by-user-id/<int:user_id>/', views.WeeklyScheduleListByUserIdView.as_view(), name='weekly-schedule-list-by-user-id'),
    path('weekly-schedule/create/', views.WeeklyScheduleCreateView.as_view(), name='weekly-schedule-create'),
    path('bulk-update-schedules/', views.WeeklyScheduleBulkUpdateView.as_view(), name='bulk-update-schedules'),

]
