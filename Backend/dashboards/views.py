from django.shortcuts import render
from rest_framework.generics import ListAPIView,RetrieveAPIView, CreateAPIView, DestroyAPIView, UpdateAPIView
from department.models import Department
from .serializers import DepartmentCountSerializer


class ListDepartmentsCount(ListAPIView):
    queryset = Department.objects.all()
    serializer_class = DepartmentCountSerializer
