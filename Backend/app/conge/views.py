from django.shortcuts import render
from rest_framework import generics
from .models import Conge
from .serializers import CongeSerializer

class CongeListCreateView(generics.ListCreateAPIView):
    queryset = Conge.objects.all()
    serializer_class = CongeSerializer

class CongeRetrieveUpdateDeleteView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Conge.objects.all()
    serializer_class = CongeSerializer
