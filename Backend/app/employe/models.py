from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from departement.models import Departement
from service.models import Service
from rest_framework_simplejwt.tokens import RefreshToken
from django.utils.timezone import now
from django.contrib.auth.hashers import make_password

class EmployeManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("L'email est obligatoire")

        email = self.normalize_email(email)
        extra_fields.setdefault("created_at", now())

        user = self.model(email=email, **extra_fields)
        
        if password:
            user.password = make_password(password)
        
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)

        return self.create_user(email, password, **extra_fields)
    
class CustomRefreshToken(RefreshToken):
    @classmethod
    def for_user(cls, user):
        token = super().for_user(user)
        
        if 'user_id' in token:
            del token['user_id']
        
        token['matricule'] = user.matricule
        token['email'] = user.email
        token['departement'] = user.departement.id
        token['role'] = user.role
        token['nom'] = user.prenom + " " + user.nom
        
        return token

class Employe(AbstractBaseUser, PermissionsMixin):
    ROLE_CHOICES = [
        ('Admin', 'Admin'),
        ('Manager', 'Manager'),
        ('Employe', 'Employé'),
    ]
    
    GENRE_CHOICES = [
        ('Femme', 'Femme'),
        ('Homme', 'Homme'),
    ]
    
    SITUATION_CHOICES = [
        ('Celibataire', 'Célibataire'),
        ('Marie', 'Marié(e)'),
        ('Divorce', 'Divorcé(e)'),
        ('Veuf', 'Veuf(ve)'),
    ]

    matricule = models.CharField(max_length=6, unique=True, primary_key=True, verbose_name="Matricule")
    nom = models.CharField(max_length=100, null=False, blank=False, verbose_name="Nom")
    prenom = models.CharField(max_length=100, null=False, blank=False, verbose_name="Prénom")
    email = models.EmailField(unique=True, null=False, blank=False, verbose_name="Email", db_index=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, null=False, blank=False, verbose_name="Rôle")
    date_de_naissance = models.DateField(null=True, blank=True, verbose_name="Date de Naissance")
    lieu_de_naissance = models.CharField(max_length=100, blank=True, default="", verbose_name="Lieu de Naissance")
    nationalite = models.CharField(max_length=100, blank=True, default="", verbose_name="Nationalité")
    genre_legal = models.CharField(max_length=10, choices=GENRE_CHOICES, verbose_name="Genre Légal")
    situation_familiale = models.CharField(max_length=20, choices=SITUATION_CHOICES, null=False, blank=False, verbose_name="Situation Familiale")
    CIN = models.CharField(max_length=20, unique=True, null=False, blank=False, verbose_name="CIN", db_index=True)
    num_telephone = models.CharField(max_length=20, unique=True, null=False, blank=False, verbose_name="Numéro de Téléphone", db_index=True)
    uid = models.PositiveIntegerField(unique=True, null=True, blank=True, verbose_name="UID")

    adresse = models.TextField(null=True, blank=True, verbose_name="Adresse")
    ville = models.CharField(max_length=100, blank=True, default="", verbose_name="Ville")
    code_postal = models.CharField(max_length=10, blank=True, default="", verbose_name="Code Postal")

    nom_urgence = models.CharField(max_length=100, null=False, blank=False, verbose_name="Nom du Contact d'Urgence")
    num_telephone_urgence = models.CharField(max_length=20, null=False, blank=False, verbose_name="Numéro de Téléphone d'Urgence")

    salaire_base = models.DecimalField(max_digits=15, decimal_places=5, null=False, blank=False, verbose_name="Salaire de Base")
    CNSS = models.CharField(max_length=50, unique=True, null=True, blank=True, verbose_name="CNSS")
    compte_bancaire = models.CharField(max_length=50, unique=True, null=True, blank=True, verbose_name="Compte Bancaire")
    rib_bancaire = models.CharField(max_length=50, unique=True, null=True, blank=True, verbose_name="RIB Bancaire")

    departement = models.ForeignKey(Departement,on_delete=models.PROTECT,null=False,blank=False,verbose_name="Departement",related_name="employes",)
    service = models.ForeignKey(Service,on_delete=models.PROTECT,null=False,blank=False,verbose_name="Service",related_name="employes",)

    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Date de Création")

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False, verbose_name="Superuser Status")

    groups = models.ManyToManyField(
        'auth.Group',
        related_name="employe_groups",
        blank=True,
        verbose_name="groups",
        help_text="The groups this user belongs to.",
    )

    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name="employe_user_permissions",
        blank=True,
        verbose_name="user permissions",
        help_text="Specific permissions for this user.",
    )

    objects = EmployeManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['nom', 'prenom', 'matricule']
    
    def __str__(self):
        return f"{self.nom} {self.prenom} ({self.matricule})"

    class Meta:
        verbose_name = "Employé"
        verbose_name_plural = "Employés"
        ordering = ['nom', 'prenom']
        constraints = [
            models.UniqueConstraint(fields=['email'], name='unique_email'),
            models.UniqueConstraint(fields=['CIN'], name='unique_cin'),
            models.UniqueConstraint(fields=['num_telephone'], name='unique_num_telephone'),
            models.UniqueConstraint(fields=['compte_bancaire'], name='unique_compte_bancaire'),
            models.UniqueConstraint(fields=['rib_bancaire'], name='unique_rib_bancaire'),
            models.UniqueConstraint(fields=['CNSS'], name='unique_cnss'),
            models.UniqueConstraint(fields=['uid'], name='unique_uid'),
        ]
        indexes = [
            models.Index(fields=['email']),
            models.Index(fields=['CIN']),
            models.Index(fields=['num_telephone']),
            models.Index(fields=['departement']),
            models.Index(fields=['service']),
        ]

    def get_tokens(self):
        refresh = CustomRefreshToken.for_user(self)
        
        return {
            "refresh": str(refresh),
            "access": str(refresh.access_token),
        }
