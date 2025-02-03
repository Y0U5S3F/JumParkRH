from django.urls import path
from dashboards import views

urlpatterns = [

    path("number-employes-by-department/", views.ListDepartmentsCount.as_view()),

]