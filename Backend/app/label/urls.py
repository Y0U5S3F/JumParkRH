from django.urls import path
from .views import LabelListView, LabelDataCreateView

urlpatterns = [
    path('labels/', LabelListView.as_view(), name='label-list'),
    path('labels/<str:matricule>/', LabelDataCreateView.as_view(), name='label-data-create'),
]
