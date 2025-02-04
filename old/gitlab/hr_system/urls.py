"""hr_system URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path,include
from django.conf import settings
from django.conf.urls.static import static

admin.site.site_header = "HR SYSTEM"
admin.site.site_title = "HR SYSTEM"
admin.site.index_title = "HR SYSTEM"



urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include("authentication.urls")),
    path('api/departments/', include("department.urls")),
    path('api/services/', include("service.urls")),
    path('api/attendances/', include("attendance.urls")),
    path('api/devices/', include("device.urls")),
    path('api/absences/', include('absence.urls')),
    path('api/conges/', include('conges.urls')),
    path('api/settings/', include('setting.urls')),
    path('api/dashboards/', include('dashboards.urls')),


    path('api/v1/', include('djoser.urls')),
    path('api/v1/', include('djoser.urls.authtoken')),

] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)