from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.exceptions import AuthenticationFailed
from employe.models import Employe  # Import your model

class CustomJWTAuthentication(JWTAuthentication):
    def get_user(self, validated_token):
        matricule = validated_token.get("matricule")  # Use matricule instead of user_id
        
        if matricule is None:
            raise AuthenticationFailed("Token contained no recognizable user identification", code="token_not_valid")

        try:
            return Employe.objects.get(matricule=matricule)
        except Employe.DoesNotExist:
            raise AuthenticationFailed("User not found", code="user_not_found")
