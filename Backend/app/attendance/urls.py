from django.urls import path
from .views import AttendanceListCreateView, AttendanceRetrieveUpdateDeleteView

urlpatterns = [
    path('attendances/', AttendanceListCreateView.as_view(), name='attendance-list-create'),
    path('attendances/<int:pk>/', AttendanceRetrieveUpdateDeleteView.as_view(), name='attendance-detail'),
]
