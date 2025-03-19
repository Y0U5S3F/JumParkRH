from django.http import StreamingHttpResponse
from django.core.serializers import serialize
from rest_framework import generics, status
from django_filters.rest_framework import DjangoFilterBackend
from employe.models import Employe
from employe.serializers import EmployeSerializer, EmployeMinimalSerializer
from employe.filters import EmployeFilter
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from django.contrib.auth.hashers import make_password


class EmployeListCreateView(generics.ListCreateAPIView):
    queryset = Employe.objects.all().order_by('matricule')
    serializer_class = EmployeSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = EmployeFilter

    def list(self, request, *args, **kwargs):
        if request.query_params.get("stream") == "true":
            return self.stream_response()
        return super().list(request, *args, **kwargs)

    def stream_response(self):
        queryset = self.filter_queryset(self.get_queryset())

        def data_stream():
            for employe in queryset.iterator(chunk_size=100):
                yield serialize("json", [employe]) + "\n"

        response = StreamingHttpResponse(data_stream(), content_type="application/json")
        response["Cache-Control"] = "no-cache"
        return response


class EmployeRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Employe.objects.all()
    serializer_class = EmployeSerializer
    lookup_field = 'matricule'

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        data = request.data.copy()

        # Check if the password is being updated
        if 'password' in data:
            password = data.pop('password')
            if password:  # Only update the password if it's not null or empty
                data['password'] = make_password(password)

        serializer = self.get_serializer(instance, data=data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        return Response(serializer.data)


class EmployeMinimalListView(generics.ListAPIView):
    queryset = Employe.objects.all()
    serializer_class = EmployeMinimalSerializer


class EmployeMinimalDetailView(generics.RetrieveAPIView):
    queryset = Employe.objects.all()
    serializer_class = EmployeMinimalSerializer
    lookup_field = 'matricule'

class EmployeLoginView(APIView):
    permission_classes = [AllowAny]  # Allow unauthenticated access
    def post(self, request, *args, **kwargs):
        email = request.data.get("email")
        password = request.data.get("password")

        try:
            # Retrieve the employee by email
            employe = Employe.objects.get(email=email)
        except Employe.DoesNotExist:
            return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

        # Check if the password is correct
        if not employe.check_password(password):
            return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

        # Check if the employe's departement_id is 2
        if employe.departement.id != 2:
            return Response({"error": "Access denied. Invalid department."}, status=status.HTTP_403_FORBIDDEN)

        tokens = employe.get_tokens()

        return Response(tokens)