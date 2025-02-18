from django.shortcuts import render
from rest_framework import generics
from departement.models import Departement
from departement.serializers import DepartementSerializer

class DepartementListCreateView(generics.ListCreateAPIView):
    queryset = Departement.objects.all().order_by('id')
    serializer_class = DepartementSerializer

class DepartementRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Departement.objects.all()
    serializer_class = DepartementSerializer
