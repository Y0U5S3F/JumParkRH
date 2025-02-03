from django.shortcuts import render

from django.shortcuts import render
from rest_framework.viewsets import ModelViewSet, GenericViewSet
from .serializers import CongeTypeSerializer, CongeSerializer
from .models import CongeType, Conge
from attendance.models import Attendance
from rest_framework.response import Response
from rest_framework import status
from datetime import timedelta


class CongeTypeViewSet(ModelViewSet):
    queryset = CongeType.objects.all()
    serializer_class = CongeTypeSerializer


class CongeViewSet(ModelViewSet):
    queryset = Conge.objects.all()
    serializer_class = CongeSerializer
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        typeConge = serializer.validated_data.get('status')
        if typeConge == 'Valider':
            start_date = serializer.validated_data.get('start_date')
            end_date = serializer.validated_data.get('end_date')
            user = serializer.validated_data.get('user')

            # Count the range date for the leave period
            range_date = (end_date - start_date).days + 1

            # Iterate over each day and create attendance objects
            current_date = start_date
            for _ in range(range_date):
                Attendance.objects.create(user=user,date=current_date,checkin='00:00', checkout='00:00',additional_hours="00:00", duration="00:00", status='Conge')
                current_date += timedelta(days=1)

        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)

        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)