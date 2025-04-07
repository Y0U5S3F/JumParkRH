from django.urls import path 
from .views import AppareilListCreateView, AppareilRetrieveUpdateDestroyView, AIChatBot

urlpatterns = [
    path('appareils/', AppareilListCreateView.as_view(), name='appareil-list'),
    path('appareils/<int:pk>/', AppareilRetrieveUpdateDestroyView.as_view(), name='appareil-retrieve-update-destroy-view'),
    path('chatbot/', AIChatBot, name='ai-chat-bot'),
]