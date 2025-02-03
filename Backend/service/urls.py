from django.urls import path
from service import views

urlpatterns = [
    path("", views.listServices.as_view()),
    path("create/", views.CreateService.as_view()),
    path("update/<int:pk>/", views.UpdateServiceAPIView.as_view(),
         name="service_update"),
    path("delete/<int:pk>/", views.DeleteServiceAPIView.as_view(),
         name="service_delete"),
    path("detail/<int:pk>/", views.DetailServiceAPIView.as_view(),
         name="service_detail"),
]
