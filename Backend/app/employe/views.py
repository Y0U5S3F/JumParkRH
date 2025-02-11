from rest_framework import generics
from django_filters.rest_framework import DjangoFilterBackend
from employe.models import Employe
from employe.serializers import EmployeSerializer
from employe.filters import EmployeFilter

class EmployeListCreateView(generics.ListCreateAPIView):
    queryset = Employe.objects.all()
    serializer_class = EmployeSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = EmployeFilter

    def perform_create(self, serializer):
        serializer.save()

class EmployeRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Employe.objects.all()
    serializer_class = EmployeSerializer
    lookup_field = 'matricule'
