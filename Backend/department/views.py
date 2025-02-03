from django.shortcuts import render
from rest_framework.generics import ListAPIView,RetrieveAPIView, CreateAPIView, DestroyAPIView, UpdateAPIView
from department.models import Department
from department.serializers import DepartmentSerializer
from rest_framework.pagination import PageNumberPagination


class CustomPagination(PageNumberPagination):
    page_size = 10 # Number of items per page
    page_query_param = 'p' # Query parameter to use for the page number
    page_size_query_param = 'page_size' # Query parameter to use for the page size
    max_page_size = 100 # Maximum number of items per page


class ListDepartments(ListAPIView):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer
    # pagination_class = CustomPagination # Use the custom pagination class

    
class CreateDepartment(CreateAPIView):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer
    
    
class UpdateDepartmentAPIView(UpdateAPIView):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer


class DeletedepartmentAPIView(DestroyAPIView):
    """This endpoint allows for deletion of a specific Bank from the database"""
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer


class DetailDepartmentAPIView(RetrieveAPIView):
    """This endpoint allows for details of a specific Bank from the database"""
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer
