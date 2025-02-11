from django.shortcuts import render
from rest_framework import generics
from .models import JourFerie
from .serializers import JourFerieSerializer

class JourFerieListCreateView(generics.ListCreateAPIView):
    queryset = JourFerie.objects.all()
    serializer_class = JourFerieSerializer

class JourFerieRetrieveUpdateDeleteView(generics.RetrieveUpdateDestroyAPIView):
    queryset = JourFerie.objects.all()
    serializer_class = JourFerieSerializer