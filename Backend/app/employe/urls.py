from django.urls import path
from employe.views import EmployeListCreateView, EmployeRetrieveUpdateDestroyView, EmployeMinimalListView, EmployeMinimalDetailView, CustomLoginView, RegisterEmployeView

urlpatterns = [
    path('employes/', EmployeListCreateView.as_view(), name='employe-list-create'),
    path('employes/minimal/', EmployeMinimalListView.as_view(), name='employe-minimal-list'),
    path('employes/minimal/<str:matricule>/', EmployeMinimalDetailView.as_view(), name='employe-minimal-detail'),
    path('employes/<str:matricule>/', EmployeRetrieveUpdateDestroyView.as_view(), name='employe-retrieve-update-destroy'),
    path('login/', CustomLoginView.as_view(), name='custom_login'),
    path('register/', RegisterEmployeView.as_view(), name='register-employe'),

]

