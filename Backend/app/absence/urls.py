from django.urls import path
from .views import AbsenceListCreateView, AbsenceRetrieveUpdateDestroyView, dashboard_stats

urlpatterns = [
    path('absences/', AbsenceListCreateView.as_view(), name='absence-list'),
    path('absences/<int:pk>/', AbsenceRetrieveUpdateDestroyView.as_view(), name='absence-retrieve-update-destroy-view'),
    path('dashboard/', dashboard_stats, name='dashboard-stats'),
]
