from rest_framework import generics
from rest_framework.response import Response
from django.core.serializers import serialize
from django.http import StreamingHttpResponse
from rest_framework import status
import json
from django.shortcuts import get_object_or_404
from .models import Label, LabelData
from .serializers import LabelSerializer, LabelDataSerializer

class LabelListCreateView(generics.ListCreateAPIView):
    queryset = Label.objects.all().order_by('id').prefetch_related('data')
    serializer_class = LabelSerializer

    def list(self, request, *args, **kwargs):
        # Check for "stream" parameter in query params.
        if request.query_params.get("stream") == "true":
            return self.stream_response()
        return super().list(request, *args, **kwargs)
    
    def stream_response(self):
        queryset = self.filter_queryset(self.get_queryset())

        def data_stream():
            for label in queryset.iterator(chunk_size=100):
                # Serialize Label
                label_data = {
                    "id": label.id,
                    "employe": label.employe.matricule,
                    "uid": label.uid,
                    "title": label.title,
                    "subtitle": label.subtitle,
                    "data": []
                }
        
                # Include related LabelData entries
                for data_entry in label.data.all():
                    label_data["data"].append({
                        "id": str(data_entry.id),
                        "startDate": data_entry.startDate.isoformat() if data_entry.startDate else None,
                        "endDate": data_entry.endDate.isoformat() if data_entry.endDate else None,
                        "startPause": data_entry.startPause.isoformat() if data_entry.startPause else None,
                        "endPause": data_entry.endPause.isoformat() if data_entry.endPause else None,
                        "status": data_entry.get_status_display(),
                    })
        
                yield f"{json.dumps(label_data)}\n"
   

        response = StreamingHttpResponse(data_stream(), content_type="application/json")
        response["Cache-Control"] = "no-cache"
        return response


    def perform_create(self, serializer):
        serializer.save()

class LabelDataCreateView(generics.CreateAPIView):
    queryset = LabelData.objects.all()
    serializer_class = LabelDataSerializer

    def create(self, request, *args, **kwargs):
        # Get the employee_uid from the URL parameters
        employe_uid = self.kwargs.get('employee_uid')

        # Fetch the latest Label for the given employee using employee_uid
        label = Label.objects.filter(employe__uid=employe_uid).order_by('-id').first()

        if not label:
            return Response({"detail": "Label not found for the given employee UID."},
                            status=status.HTTP_404_NOT_FOUND)

        # Add the label ID to the request data
        data = request.data.copy()
        data['label'] = label.id  

        # Serialize and save the new LabelData
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    
class LabelDataRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = LabelData.objects.all()
    serializer_class = LabelDataSerializer
    lookup_field = "id"