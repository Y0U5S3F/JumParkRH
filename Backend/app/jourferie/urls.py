from django.urls import path
from .views import JourFerieListCreateView, JourFerieRetrieveUpdateDeleteView

urlpatterns = [
    path('jourferies/', JourFerieListCreateView.as_view(), name='jour-ferie-list-create'),
    path('jourferies/<int:pk>/', JourFerieRetrieveUpdateDeleteView.as_view(), name='jour-ferie-detail'),
]