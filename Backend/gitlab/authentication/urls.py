from django.urls import path
from authentication import views
from .views import LogoutAPIView, LoginAPIView, JWTAuthentication
from rest_framework_simplejwt.views import (
    TokenRefreshView,
)

urlpatterns = [
    path('login/', LoginAPIView.as_view(), name="login"),
    path('logout/', LogoutAPIView.as_view(), name="logout"),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    path('register/employee/', views.RegisterEmployee.as_view(), name="register_employee"),
    path('register/manager/', views.RegisterManager.as_view(), name="register_manager"),
    path('register/admin/', views.RegisterAdmin.as_view(), name="register_admin"),
    path('employees/', views.ListEmployees.as_view(), name="list_employees"),
    path('list-employes/', views.ListEmployeesNotDeleted.as_view(), name="ListEmployeesNotDeleted"),
    path('employees-pagination/', views.ListEmployeesPagination.as_view(), name="list_employees_pagination"),
    path('manager/', views.ListManger.as_view(), name="list_employees"),
    path('users/', views.ListUsers.as_view(), name="list_users"),
    path('me/', JWTAuthentication.as_view() , name='me'),
    path("delete/<int:pk>/", views.DeleteUserAPIView.as_view(),
         name="user_delete"),
    path("users/detail/<int:pk>/", views.DetailUserAPIView.as_view(),
         name="user_detail"),
    path("users/update/<int:pk>/", views.UpdateUserAPIView.as_view(),
         name="user_update"),    
    path("users/delete/<int:pk>/", views.DeletedAPIView.as_view(),
         name="user_deleted"),


]
