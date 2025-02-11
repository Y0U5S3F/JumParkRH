from django.shortcuts import render
from rest_framework import generics
from .models import Emploi
from .serializers import EmploiSerializer

class EmploiListCreateView(generics.ListCreateAPIView):
    queryset = Emploi.objects.all()
    serializer_class = EmploiSerializer

class EmploiRetrieveUpdateDeleteView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Emploi.objects.all()
    serializer_class = EmploiSerializer
