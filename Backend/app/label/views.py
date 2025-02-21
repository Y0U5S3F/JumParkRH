from rest_framework import generics
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from .models import Label, LabelData
from .serializers import LabelSerializer, LabelDataSerializer

# Get all labels
class LabelListView(generics.ListAPIView):
    queryset = Label.objects.all().prefetch_related('data')
    serializer_class = LabelSerializer

class LabelDataCreateView(generics.CreateAPIView):
    serializer_class = LabelDataSerializer

    def create(self, request, *args, **kwargs):
        matricule = self.kwargs.get('matricule')
        label = Label.objects.filter(employe__matricule=matricule).order_by('-id').first()
        if not label:
            return Response({"detail": "Label not found for the given employee matricule."},
                            status=status.HTTP_404_NOT_FOUND)
        
        data = request.data.copy()
        data['label'] = label.id
        
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
