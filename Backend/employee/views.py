from django.shortcuts import render
from rest_framework import generics
from .models import Employe
from .serializers import EmployeSerializer

class EmployeListCreateView(generics.ListCreateAPIView):
    queryset = Employe.objects.all()
    serializer_class = EmployeSerializer