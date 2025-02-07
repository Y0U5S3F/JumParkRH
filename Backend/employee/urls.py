from django.urls import path
from .views import EmployeListCreateView

urlpatterns = [
    path('employes/', EmployeListCreateView.as_view(), name='employe-list-create'),
]