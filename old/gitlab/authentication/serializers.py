from rest_framework import serializers
from .models import Employee, HR
from .models import UserAccount
from rest_framework.authtoken.models import Token
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from django.utils.encoding import smart_str, force_str, smart_bytes, DjangoUnicodeDecodeError
from django.contrib import auth
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.tokens import RefreshToken, TokenError
from django.contrib.auth.tokens import PasswordResetTokenGenerator





from django.contrib.auth import get_user_model
User = get_user_model()



class LoginSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(max_length=255, min_length=3)
    password = serializers.CharField(
        max_length=68, min_length=4, write_only=True)
    # username = serializers.CharField(
    #     max_length=255, min_length=3, read_only=True)
    # employe_department = serializers.CharField(
    #     source='employee.department', read_only=True)
    # department_id = serializers.CharField(
    #     source='employee.department.id', read_only=True)
    # groups = GroupSerializer(read_only=True)
    # tokens = serializers.CharField(source='tokens.key', read_only=True)
    tokens = serializers.SerializerMethodField()
    def get_tokens(self, obj):
        user = User.objects.get(email=obj['email'])

        return {
            'refresh': user.tokens()['refresh'],
            'access': user.tokens()['access']
        }

    class Meta:
        model = UserAccount
        fields = ['id', 'email','password', 'tokens', 'full_name','role','is_superuser']

    def validate(self, attrs):
        email = attrs.get('email', '')
        password = attrs.get('password', '')
        filtered_user_by_email = UserAccount.objects.filter(email=email)
        print('userr', filtered_user_by_email)
        user = auth.authenticate(email=email, password=password)
        print('userrr', user.role)
        token, created = Token.objects.get_or_create(user=user)
        # employe_department = serializers.CharField(
        # source='employee.department', read_only=True)
        # department_id = serializers.CharField(
        # source='employee.department.id', read_only=True)
        if filtered_user_by_email.exists() and filtered_user_by_email[0].auth_provider != 'email':
            raise AuthenticationFailed(
                detail='Please continue your login using ' + filtered_user_by_email[0].auth_provider)

        if not user:
            raise AuthenticationFailed('Invalid credentials, try again')
        if not user.is_active:
            raise AuthenticationFailed('Account disabled, contact admin')
        # if not user.is_verified:
        #     raise AuthenticationFailed('Email is not verified')

        return {
            'is_superuser': user.is_superuser,
            'email': user.email,
            'tokens': token,
            'id': user.id,
            'full_name': user.full_name,
            'role': user.role,
            # 'employee': user.employee,
            # 'employe_department': employe_department,
            # 'department_id': department_id,
        }

        return super().validate(attrs)



class RegisterEmployeeSerializer(serializers.ModelSerializer):
    password = serializers.CharField(max_length=255, min_length=6, write_only=True)

    class Meta:
        model = Employee
        fields = 'email','password','first_name','last_name','phone','matricule'

    def validate(self, attrs):
        return attrs

    def create(self, validated_data):
        return Employee.objects.create_user(**validated_data)

class RegisterManagerSerializer(serializers.ModelSerializer):
    password = serializers.CharField(max_length=255, min_length=6, write_only=True)

    class Meta:
        model = HR
        fields = 'email', 'password','first_name','last_name','phone'

    def validate(self, attrs):
        return attrs

    def create(self, validated_data):
        return HR.objects.create_user(**validated_data)
    
class RegisterAdminSerializer(serializers.ModelSerializer):
    password = serializers.CharField(max_length=255, min_length=6, write_only=True)

    class Meta:
        model = UserAccount
        fields = 'email', 'password'

    def validate(self, attrs):
        return attrs

    def create(self, validated_data):
        return UserAccount.objects.create_user(**validated_data)


class ListEmployeesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = ('id', 'email','full_name','role','is_active','status','is_superuser','department','picture')

class ListEmployeesPSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = ('id', 'email','full_name','role','is_active','status','is_superuser','department','picture')


class ListManagerSerializer(serializers.ModelSerializer):
    class Meta:
        model = HR
        fields = ('id', 'email','full_name','role','is_active','status','is_superuser')



class ListUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'email','full_name','role','is_active','status','is_superuser')
        
        
class DeleteUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id','is_deleted')


class DetailUserSerializer(serializers.ModelSerializer):
    fonction = serializers.CharField(source='fonction.name', read_only=True)
    department_name = serializers.CharField(source='department.name', read_only=True)
    class Meta:
        model = User
        fields = ('id', 'last_login','is_active','full_name','matricule','email','first_name','last_name','picture','gender_user', 'date_of_birth'
                  ,'place_of_birth','nationality','address','city','postal_code','rib','department','department_name','fonction')



class ResetPasswordEmailRequestSerializer(serializers.Serializer):
    email = serializers.EmailField(min_length=2)

    redirect_url = serializers.CharField(max_length=500, required=False)

    class Meta:
        fields = ['email']


class SetNewPasswordSerializer(serializers.Serializer):
    password = serializers.CharField(
        min_length=6, max_length=68, write_only=True)
    token = serializers.CharField(
        min_length=1, write_only=True)
    uidb64 = serializers.CharField(
        min_length=1, write_only=True)

    class Meta:
        fields = ['password', 'token', 'uidb64']

    def validate(self, attrs):
        try:
            password = attrs.get('password')
            token = attrs.get('token')
            uidb64 = attrs.get('uidb64')

            id = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(id=id)
            if not PasswordResetTokenGenerator().check_token(user, token):
                raise AuthenticationFailed('The reset link is invalid', 401)

            user.set_password(password)
            user.save()

            return (user)
        except Exception as e:
            raise AuthenticationFailed('The reset link is invalid', 401)
        return super().validate(attrs)

class LogoutSerializer(serializers.Serializer):
    refresh = serializers.CharField()

    default_error_message = {
        'bad_token': ('Token is expired or invalid')
    }

    def validate(self, attrs):
        self.token = attrs['refresh']
        return attrs

    def save(self, **kwargs):

        try:
            RefreshToken(self.token).blacklist()

        except TokenError:
            self.fail('bad_token')



class UserListSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields='__all__'
