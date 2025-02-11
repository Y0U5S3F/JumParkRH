from django.shortcuts import render
from rest_framework import generics
from .models import Appareil
from .serializers import AppareilSerializer

class AppareilListCreateView(generics.ListCreateAPIView):
    queryset = Appareil.objects.all()
    serializer_class = AppareilSerializer

class AppareilRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Appareil.objects.all()
    serializer_class = AppareilSerializer
