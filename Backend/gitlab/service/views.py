from django.http.response import JsonResponse
from django.shortcuts import render
from rest_framework.generics import ListAPIView,RetrieveAPIView,CreateAPIView, DestroyAPIView, UpdateAPIView
from service.models import Service
from service.serializers import ServiceSerializer

class listServices(ListAPIView):
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer
    
    
class CreateService(CreateAPIView):
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer
    
    
class UpdateServiceAPIView(UpdateAPIView):
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer


class DeleteServiceAPIView(DestroyAPIView):
    """This endpoint allows for deletion of a specific Bank from the database"""
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer


class DetailServiceAPIView(RetrieveAPIView):
    """This endpoint allows for details of a specific Bank from the database"""
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer