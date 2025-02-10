from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/absence/', include('absence.urls')),
    path('api/appareil/', include('appareil.urls')),
    path('api/attendance/', include('attendance.urls')),
    path('api/conge/', include('conge.urls')),
    path('api/departement/', include('departement.urls')),
    path('api/emploi/', include('emploi.urls')),
    path('api/employe/', include('employe.urls')),
    path('api/jourferie/', include('jourferie.urls')),
    path('api/salaire/', include('salaire.urls')),
    path('api/service/', include('service.urls')),
]