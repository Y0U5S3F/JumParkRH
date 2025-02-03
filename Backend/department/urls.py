from django.urls import path
from department import views

urlpatterns = [
    path("", views.ListDepartments.as_view()),
    path("create/", views.CreateDepartment.as_view()),
    path("update/<int:pk>/", views.UpdateDepartmentAPIView.as_view(),
         name="department_update"),
    path("delete/<int:pk>/", views.DeletedepartmentAPIView.as_view(),
         name="department_delete"),
    path("detail/<int:pk>/", views.DetailDepartmentAPIView.as_view(),
         name="department_detail"),

]