from django.shortcuts import render
from rest_framework import generics
from .models import TypeConge
from .serializers import TypeCongeSerializer

class TypeCongeListCreateView(generics.ListCreateAPIView):
    queryset = TypeConge.objects.all().order_by('id')
    serializer_class = TypeCongeSerializer

class TypeCongeRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = TypeConge.objects.all()
    serializer_class = TypeCongeSerializer