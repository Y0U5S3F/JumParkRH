from django.urls import path, include
from . import views
from rest_framework_nested import routers


router = routers.DefaultRouter()

router.register("conges", views.CongeViewSet)
router.register("conge-type", views.CongeTypeViewSet)
# router.register("day", views.DayViewSet)

urlpatterns = [
    path("", include(router.urls)),
]
