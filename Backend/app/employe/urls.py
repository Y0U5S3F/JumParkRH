from django.urls import path
from employe.views import EmployeListCreateView, EmployeRetrieveUpdateDestroyView, EmployeMinimalListView

urlpatterns = [
    path('employes/', EmployeListCreateView.as_view(), name='employe-list-create'),
    path('employes/<str:matricule>/', EmployeRetrieveUpdateDestroyView.as_view(), name='employe-retrieve-update-destroy'),
    path('employes/minimal/', EmployeMinimalListView.as_view(), name='employe-minimal-list'),
]

