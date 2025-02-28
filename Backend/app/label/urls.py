from django.urls import path
from .views import LabelListCreateView, LabelDataCreateView, LabelDataRetrieveUpdateDestroyView

urlpatterns = [
    path('labels/', LabelListCreateView.as_view(), name='label-list-create'),
    path('labels/<str:matricule>/', LabelDataCreateView.as_view(), name='label-data-create'),
    path('labels/auto/<str:employee_uid>/', LabelDataCreateView.as_view(), name='label-data-auto-create'),
    path('labels/data/<uuid:id>/', LabelDataRetrieveUpdateDestroyView.as_view(), name='label-data-detail'),
]
