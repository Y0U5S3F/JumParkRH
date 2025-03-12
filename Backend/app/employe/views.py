from django.http import StreamingHttpResponse
from django.core.serializers import serialize
from rest_framework import generics, status
from django_filters.rest_framework import DjangoFilterBackend
from employe.models import Employe
from employe.serializers import EmployeSerializer, EmployeMinimalSerializer
from employe.filters import EmployeFilter
from django.contrib.auth import authenticate
from rest_framework.response import Response
from rest_framework.views import APIView

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

    def perform_create(self, serializer):
        # Automatically hash the password before saving
        password = serializer.validated_data.pop("password", None)
        employe = serializer.save()

        if password:
            employe.set_password(password)  # Hash the password
            employe.save()


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


class CustomLoginView(APIView):
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        # Authenticate using plain password (not a hash)
        user = authenticate(request, email=email, password=password)

        if user is None:
            return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

        # Ensure user is active and belongs to department 2
        if not user.is_active or user.departement_id != 2:
            return Response({"error": "Unauthorized access"}, status=status.HTTP_403_FORBIDDEN)

        # Get the JWT tokens (or custom token method)
        tokens = user.get_tokens_for_user()

        return Response(tokens, status=status.HTTP_200_OK)


class CreateEmployeView(APIView):
    def post(self, request):
        try:
            # Extract data
            data = request.data
            employe = Employe.objects.create_user(
                matricule=data["matricule"],
                nom=data["nom"],
                prenom=data["prenom"],
                email=data["email"],
                password=data["password"],
                role=data["role"],
                date_de_naissance=data["date_de_naissance"],
                lieu_de_naissance=data["lieu_de_naissance"],
                nationalite=data["nationalite"],
                genre_legal=data["genre_legal"],
                situation_familiale=data["situation_familiale"],
                CIN=data["CIN"],
                uid=data["uid"],
                num_telephone=data["num_telephone"],
                adresse=data["adresse"],
                ville=data["ville"],
                code_postal=data["code_postal"],
                nom_urgence=data["nom_urgence"],
                num_telephone_urgence=data["num_telephone_urgence"],
                salaire_base=data["salaire_base"],
                CNSS=data["CNSS"],
                compte_bancaire=data["compte_bancaire"],
                rib_bancaire=data["rib_bancaire"],
                departement_id=data["departement"],
                service_id=data["service"],
                is_active=data.get("is_active", True),
                is_staff=data.get("is_staff", False),
                is_superuser=data.get("is_superuser", False),
            )
            return Response({"message": "Employé créé avec succès", "id": employe.matricule}, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class RegisterEmployeView(APIView):
    def post(self, request):
        serializer = EmployeSerializer(data=request.data)
        if serializer.is_valid():
            password = serializer.validated_data.pop("password", None)

            # Ensure password is hashed using create_user
            employe = Employe.objects.create_user(
                password=password,  # Plain password
                **serializer.validated_data
            )

            return Response({"message": "Employe created successfully!"}, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
