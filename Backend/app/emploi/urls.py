from django.urls import path
from .views import EmploiListCreateView, EmploiRetrieveUpdateDeleteView

urlpatterns = [
    path('emplois/', EmploiListCreateView.as_view(), name='emploi-list-create'),
    path('emplois/<int:pk>/', EmploiRetrieveUpdateDeleteView.as_view(), name='emploi-detail'),
]