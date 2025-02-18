from django.http import StreamingHttpResponse
from rest_framework.pagination import LimitOffsetPagination
from rest_framework.response import Response
from rest_framework import generics
from django.core.serializers import serialize
from .models import Emploi
from .serializers import EmploiSerializer

class EmploiListCreateView(generics.ListCreateAPIView):
    queryset = Emploi.objects.all()
    serializer_class = EmploiSerializer
    pagination_class = LimitOffsetPagination

    def list(self, request, *args, **kwargs):
        if request.query_params.get("stream") == "true":
            return self.stream_response()
        
        return super().list(request, *args, **kwargs)

    def stream_response(self):
        def data_stream():
            for emploi in Emploi.objects.iterator(chunk_size=100):
                yield serialize("json", [emploi]) + "\n"
        
        response = StreamingHttpResponse(data_stream(), content_type="application/json")
        response["Cache-Control"] = "no-cache"
        return response


class EmploiRetrieveUpdateDeleteView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Emploi.objects.all()
    serializer_class = EmploiSerializer
