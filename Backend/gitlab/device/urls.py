from django.urls import path
from device import views

urlpatterns = [
    path("", views.ListDevices.as_view()),
    path("create/", views.CreateDevice.as_view()),
    path("update/<int:pk>/", views.UpdateDeviceAPIView.as_view(),
         name="device_update"),
    path("delete/<int:pk>/", views.DeleteDeviceAPIView.as_view(),
         name="device_delete"),
    path("detail/<int:pk>/", views.DetailDeviceAPIView.as_view(),
         name="device_detail"),    
    path("connect/", views.connect, name="device_connection"),

]