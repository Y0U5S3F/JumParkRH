from django.urls import path
from .views import LabelListCreateView, LabelDataCreateView, LabelDataRetrieveUpdateDestroyView

urlpatterns = [
    path('labels/', LabelListCreateView.as_view(), name='label-list-create'),
    path('labels/create/<str:matricule>/', LabelDataCreateView.as_view(), name='label-data-create'),
    path('labels/<uuid:id>/', LabelDataRetrieveUpdateDestroyView.as_view(), name='label-data-detail'),
]
