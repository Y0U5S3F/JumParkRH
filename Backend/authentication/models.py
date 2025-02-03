from django.db import models
from django.contrib.auth.models import AbstractBaseUser , BaseUserManager
from rest_framework_simplejwt.tokens import RefreshToken
from service.models import Service
from department.models import Department

class UserAccountManager(BaseUserManager):
	def create_user(self , email , password = None):
		if not email or len(email) <= 0 :
			raise ValueError("Email field is required !")
		if not password :
			raise ValueError("Password is must !")
		
		user = self.model(
			email = self.normalize_email(email) ,
		)
		user.set_password(password)
		user.save(using = self._db)
		return user
	
	def create_superuser(self , email , password):
		user = self.create_user(
			email = self.normalize_email(email) ,
			password = password
		)
		user.is_admin = True
		user.is_staff = True
		user.is_superuser = True
		user.save(using = self._db)
		return user


AUTH_PROVIDERS = {'facebook': 'facebook', 'google': 'google',
                  'twitter': 'twitter', 'email': 'email'}
	
class UserAccount(AbstractBaseUser):
	gender_user = (
    ("homme", 'homme'),
    ("femme", 'femme'),
	)	

	class Types(models.TextChoices):
		admin = "admin" , "admin"
		HR = "HR" , "HR"
		EMPLOYEE = "employee" , "employee"
		
	role = models.CharField(max_length = 8 , choices = Types.choices ,default = Types.admin)
	email = models.EmailField(max_length=255, unique=True)
	first_name=models.CharField(max_length=100,null=True, blank=True)
	matricule=models.CharField(max_length=100,null=True, blank=True)
	last_name=models.CharField(max_length=100,null=True, blank=True)
	registration_number= models.CharField(max_length=255 ,null=True, blank=True)
	cin = models.CharField(max_length=8, null=True, blank=True)
	gender_user = models.CharField(
        max_length=200, choices=gender_user, default="homme", blank=True, null=True)	
	picture = models.FileField(
        upload_to='profile_picture/', blank=True, null=True)
	family_situation = models.CharField(max_length=255, null=True, blank=True)
	date_of_birth = models.DateField(blank=True, null=True)
	place_of_birth = models.CharField(
        max_length=255, null=True, blank=True)
	nationality = models.CharField(
        max_length=255, null=True, blank=True)
	address = models.CharField(max_length=255, null=True, blank=True)
	city = models.CharField(max_length=255, null=True, blank=True)
	postal_code = models.CharField(
        max_length=255, null=True, blank=True)
	rib = models.CharField(max_length=255, null=True,
                           blank=True)
	is_active = models.BooleanField(default = True)
	is_admin = models.BooleanField(default = False)
	is_staff = models.BooleanField(default = False)
	is_superuser = models.BooleanField(default = False)
	
	# special permission which define that
	is_hr = models.BooleanField(default = False)
	is_employee = models.BooleanField(default = False)
	department = models.ForeignKey(Department, on_delete=models.CASCADE, blank=True, null=True,related_name='employees') 
	fonction = models.ForeignKey(Service, on_delete=models.CASCADE, blank=True, null=True)
	is_deleted = models.BooleanField(default = False)
	USERNAME_FIELD = "email"
	auth_provider = models.CharField(
        max_length=255, blank=False,
        null=False, default=AUTH_PROVIDERS.get('email'))

	# defining the manager for the UserAccount model
	objects = UserAccountManager()
 
	def tokens(self):
		refresh = RefreshToken.for_user(self)
		return {
				'refresh': str(refresh),
				'access': str(refresh.access_token)
		}

	def __str__(self):
		return str(self.email)
	class Meta:
		ordering = ['id']
	@property
	def full_name(self):
		return "%s %s" % (self.first_name, self.last_name)
	@property
	def status(self):
		if self.is_active == True:
			status = "active"
		else:
			status = "inactive"
   
		return status
	# class Meta:
	# 	ordering = ['-created_at']
  
	def has_perm(self , perm, obj = None):
		return self.is_admin

	def has_module_perms(self , app_label):
		return True

	def save(self , *args , **kwargs):
		if not self.role or self.role == None :
			self.type = UserAccount.Types.admin
		return super().save(*args , **kwargs)


# user types
class HRManager(models.Manager):
	def create_user(self , email , last_name, first_name, phone, password = None):
		if not email or len(email) <= 0 :
			raise ValueError("Email field is required !")
		if not password :
			raise ValueError("Password is must !")
		email = email.lower()
		user = self.model(
			email = email,
			first_name=first_name,
			last_name=last_name,
			phone=phone,
		)
		user.set_password(password)
		user.save(using = self._db)
		return user

	def get_queryset(self , *args, **kwargs):
		queryset = super().get_queryset(*args , **kwargs)
		queryset = queryset.filter(role = UserAccount.Types.HR)
		return queryset

class HR(UserAccount):
    
    phone = models.CharField(max_length=255, null=True, blank=True)
    objects = HRManager()
    # class Meta :
    #     proxy = True
	
    def save(self , *args , **kwargs):
        self.role = UserAccount.Types.HR
        self.is_hr = True
        return super().save(*args , **kwargs)	

		
class EmployeeManager(models.Manager):
	def create_user(self , email , last_name, matricule, first_name, phone, password = None):
		if not email or len(email) <= 0 :
			raise ValueError("Email field is required !")
		if not password :
			raise ValueError("Password is must !")
		email = email.lower()
		user = self.model(
			email = email,
			first_name=first_name,
			last_name=last_name,
			matricule=matricule,
			phone=phone,
		)
		user.set_password(password)
		user.save(using = self._db)
		return user
		
	def get_queryset(self , *args , **kwargs):
		queryset = super().get_queryset(*args , **kwargs)
		queryset = queryset.filter(role = UserAccount.Types.EMPLOYEE)
		return queryset
	
class Employee(UserAccount):

	phone = models.CharField(max_length=255, null=True, blank=True)


	objects = EmployeeManager()
	# class Meta:
	# 	proxy = True


	def save(self , *args , **kwargs):
		self.role = UserAccount.Types.EMPLOYEE
		self.is_employee = True
		return super().save(*args , **kwargs)	

	# class Meta:
	# 	ordering = ['-created_at']