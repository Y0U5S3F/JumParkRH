from django.urls import path
from .views import CongeListCreateView, CongeRetrieveUpdateDeleteView

urlpatterns = [
    path('conges/', CongeListCreateView.as_view(), name='conge-list-create'),
    path('conges/<int:pk>/', CongeRetrieveUpdateDeleteView.as_view(), name='conge-detail'),
]