from django.urls import path
from .views import SalaireListCreateView, SalaireRetrieveUpdateDestroyView, generetfichedepaie, SalaireBaseView

urlpatterns = [
    path('salaires/', SalaireListCreateView.as_view(), name='salaire-list-create'),
    path('salaires/<int:pk>/', SalaireRetrieveUpdateDestroyView.as_view(), name='salaire-retrieve-update-destroy'),
    path('generer/<int:id>/', generetfichedepaie, name='generer_fiche_de_paie'),
    path("options/<str:matricule>/", SalaireBaseView.as_view(), name="salaire-base"),
]