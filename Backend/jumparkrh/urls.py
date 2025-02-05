from django.contrib import admin
from django.urls import path, include
from personnel.views import CreateUserView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('personnel/user/create/', CreateUserView.as_view(), name='create_user'),
    path('personnel/token', TokenObtainPairView.as_view(), name='get_token'),
    path('personnel/token/refresh', TokenRefreshView.as_view(), name='refresh_token'),
    path('api-auth/', include('rest_framework.urls')),
]
