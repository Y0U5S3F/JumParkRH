from django.urls import path
from service.views import ServiceListCreateView, ServiceRetrieveUpdateDestroyView

urlpatterns = [
    path('services/', ServiceListCreateView.as_view(), name='service-list-create'),
    path('services/<int:pk>/', ServiceRetrieveUpdateDestroyView.as_view(), name='service-retrieve-update-destroy'),
]