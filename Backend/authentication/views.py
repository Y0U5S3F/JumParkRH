from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.response import Response

from .serializers import DetailUserSerializer, ListEmployeesPSerializer,DeleteUserSerializer, RegisterEmployeeSerializer,RegisterAdminSerializer,RegisterManagerSerializer,UserListSerializer,ListUserSerializer,ListManagerSerializer, ListEmployeesSerializer,LogoutSerializer, LoginSerializer
from .models import Employee, HR, UserAccount
from django.contrib.sites.shortcuts import get_current_site
from django.conf import settings
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.generics import ListAPIView, DestroyAPIView, RetrieveAPIView, UpdateAPIView
from rest_framework import generics, status, views, permissions
from rest_framework.views import APIView
import jwt
from rest_framework.exceptions import ValidationError
from rest_framework.pagination import PageNumberPagination
from django.contrib.auth import get_user_model
User = get_user_model()


class LoginAPIView(generics.GenericAPIView):
    serializer_class = LoginSerializer
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class RegisterEmployee(generics.GenericAPIView):
    serializer_class = RegisterEmployeeSerializer
    def post(self, request):
        user = request.data
        serializer = self.serializer_class(data=user)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        user_data = serializer.data
        user = Employee.objects.get(email=user_data['email'])

        return Response({'Successful': 'Opération réussie. User Created.' + str(user)}, status=status.HTTP_201_CREATED)


class RegisterManager(generics.GenericAPIView):
    serializer_class = RegisterManagerSerializer

    def post(self, request):
        user = request.data
        serializer = self.serializer_class(data=user)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        user_data = serializer.data
        user = HR.objects.get(email=user_data['email'])

        return Response({'Successful': 'Opération réussie. User Created.' + str(user)}, status=status.HTTP_201_CREATED)

class RegisterAdmin(generics.GenericAPIView):
    serializer_class = RegisterAdminSerializer

    def post(self, request):
        user = request.data
        serializer = self.serializer_class(data=user)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        user_data = serializer.data
        user = UserAccount.objects.get(email=user_data['email'])

        return Response({'Successful': 'Opération réussie. User Created.' + str(user)}, status=status.HTTP_201_CREATED)



class ListEmployees(ListAPIView):
    queryset = Employee.objects.all()
    serializer_class = ListEmployeesSerializer
    
class ListEmployeesNotDeleted(ListAPIView):
    queryset = Employee.objects.filter(is_deleted=False)
    serializer_class = ListEmployeesSerializer
    
    
class ListEmployeesPagination(ListAPIView):
    queryset = Employee.objects.all()
    serializer_class = ListEmployeesPSerializer
    pagination_class = PageNumberPagination

    def get(self, request, *args, **kwargs):
        self.pagination_class.page_size = 6  
        self.pagination_class.page_query_param = 'page'  
        self.pagination_class.page_query_description = 'Page number (starting from 0)'  
        self.pagination_class.max_page_size = 10  
        
        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)
        
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    
    
class ListManger(ListAPIView):
    queryset = HR.objects.all()
    serializer_class = ListManagerSerializer
    permission_classes = [AllowAny]
    
  
class ListUsers(ListAPIView):
    queryset = User.objects.all().order_by('-id')
    serializer_class = ListUserSerializer
    permission_classes = [AllowAny]
    
# archived user
class DeletedAPIView(UpdateAPIView):
    queryset = User.objects.filter(is_deleted=False)
    serializer_class = DeleteUserSerializer


class LogoutAPIView(generics.GenericAPIView):
    serializer_class = LogoutSerializer

    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request):

        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(status=status.HTTP_204_NO_CONTENT)


class JWTAuthentication(APIView):
    serializer_class = UserListSerializer
    permission_classes = [AllowAny]
    def get(self, request):
        token = request.META.get('HTTP_AUTHORIZATION', " ").split(" ")[0]
        data = {'token': str(token)}

        try:
            valid_data = jwt.decode(
                token,  settings.SECRET_KEY, algorithms=["HS256"])
            user = valid_data['user_id']
            user_obj = User.objects.filter(pk=user)
            serializer = self.serializer_class(user_obj, many=True)

            response = {
                'success': True,
                'status_code': status.HTTP_200_OK,
                'message': 'Successfully get user from Token jwt',
                'users': serializer.data
            }
            return Response(response, status=status.HTTP_200_OK)
        except ValidationError as v:
            print("validation error", v)
            return Response({'error': 'Token is not valid, please request a new one'}, status=status.HTTP_400_BAD_REQUEST)



class DeleteUserAPIView(DestroyAPIView):
    """This endpoint allows for deletion of a specific User from the database"""
    queryset = User.objects.all()
    serializer_class = ListUserSerializer
    
    
class DetailUserAPIView(RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = DetailUserSerializer
    
class UpdateUserAPIView(UpdateAPIView):
    queryset = User.objects.all()
    serializer_class = DetailUserSerializer

