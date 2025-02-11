from django.shortcuts import render
from rest_framework import generics
from .models import Salaire
from .serializers import SalaireSerializer

class SalaireListCreateView(generics.ListCreateAPIView):
    queryset = Salaire.objects.all()
    serializer_class = SalaireSerializer

class SalaireRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Salaire.objects.all()
    serializer_class = SalaireSerializer