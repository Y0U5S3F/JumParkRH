from django.http import StreamingHttpResponse
from django.core.serializers import serialize
from rest_framework import generics
from django_filters.rest_framework import DjangoFilterBackend
from employe.models import Employe
from employe.serializers import EmployeSerializer, EmployeMinimalSerializer
from employe.filters import EmployeFilter

class EmployeListCreateView(generics.ListCreateAPIView):
    queryset = Employe.objects.all().order_by('matricule')
    serializer_class = EmployeSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = EmployeFilter

    def list(self, request, *args, **kwargs):
        # Check for "stream" parameter in query params.
        if request.query_params.get("stream") == "true":
            return self.stream_response()
        return super().list(request, *args, **kwargs)

    def stream_response(self):
        # Apply filters to the base queryset.
        queryset = self.filter_queryset(self.get_queryset())

        # Generator function to yield JSON for each Employe.
        def data_stream():
            for employe in queryset.iterator(chunk_size=100):
                yield serialize("json", [employe]) + "\n"

        response = StreamingHttpResponse(data_stream(), content_type="application/json")
        response["Cache-Control"] = "no-cache"
        return response

    def perform_create(self, serializer):
        serializer.save()

class EmployeRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Employe.objects.all()
    serializer_class = EmployeSerializer
    lookup_field = 'matricule'

class EmployeMinimalListView(generics.ListAPIView):
    queryset = Employe.objects.all()
    serializer_class = EmployeMinimalSerializer

class EmployeMinimalDetailView(generics.RetrieveAPIView):
    queryset = Employe.objects.all()
    serializer_class = EmployeMinimalSerializer
    lookup_field = 'matricule'
