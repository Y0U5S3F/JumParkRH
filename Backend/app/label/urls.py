from django.urls import path
from .views import LabelListCreateView, LabelDataCreateView, LabelDataRetrieveUpdateDestroyView, LabelDataCreateManualView

urlpatterns = [
    path('labels/', LabelListCreateView.as_view(), name='label-list-create'),
    path('labels/<str:matricule>/', LabelDataCreateManualView.as_view(), name='label-data-create'),
    path('labels/auto/<int:employe_uid>/', LabelDataCreateView.as_view(), name='label-data-create-auto'),
    path('labels/data/<uuid:id>/', LabelDataRetrieveUpdateDestroyView.as_view(), name='label-data-detail'),
]
