from django.urls import path 
from .views import AppareilListCreateView, AppareilRetrieveUpdateDestroyView

urlpatterns = [
    path('appareils/', AppareilListCreateView.as_view(), name='appareil-list'),
    path('appareils/<int:pk>/', AppareilRetrieveUpdateDestroyView.as_view(), name='appareil-retrieve-update-destroy-view'),
]
