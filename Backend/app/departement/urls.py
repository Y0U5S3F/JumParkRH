from django.urls import path
from departement.views import DepartementListCreateView, DepartementRetrieveUpdateDestroyView

urlpatterns = [
    path('departements/', DepartementListCreateView.as_view(), name='departement-list-create'),
    path('departements/<int:pk>/', DepartementRetrieveUpdateDestroyView.as_view(), name='departement-retrieve-update-destroy'),
]