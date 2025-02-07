from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/employe/', include('employe.urls')),
    path('api/departement/', include('departement.urls')),
    path('api/service/', include('service.urls')),
]