from django.urls import path
from .views import TypeCongeListCreateView, TypeCongeRetrieveUpdateDestroyView

urlpatterns = [
    path('typeconge/', TypeCongeListCreateView.as_view(), name='typeconge-list-create'),
    path('typeconge/<int:pk>/', TypeCongeRetrieveUpdateDestroyView.as_view(), name='typeconge-retrieve-update-destroy'),
]