from django.urls import path, include
from . import views
from rest_framework_nested import routers


router = routers.DefaultRouter()

router.register("absences", views.AbsenceViewSet)
router.register("absence-type", views.AbsenceTypeViewSet)
# router.register("day", views.DayViewSet)

urlpatterns = [
    path("", include(router.urls)),
]
