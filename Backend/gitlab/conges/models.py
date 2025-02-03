from django.db import models
from core.models import TimeStampedModel
from colorfield.fields import ColorField
from datetime import datetime
from authentication.models  import UserAccount

#from employee.models  import employee
# Create your models here.

ETAT_CHOICES = (
    ('Certifiée', 'Certifiée'),
    ('R', 'Refuse'),
    ('NonCertifiée', 'NonCertifiée'),
)

Status_CHOICES = (
    ('Valider', 'Valider'),
    ('Refuser', 'Refuser'),
    ('En_cours', 'En_cours'),
 
)

class CongeType(TimeStampedModel):
    # user = models.ForeignKey(
    #     User, null=True, blank=True, on_delete=models.CASCADE)
    name = models.CharField(max_length=255, null=True, blank=True)
    color = ColorField(null=True, blank=True)
    is_approbation = models.BooleanField(default=False)
    is_sold = models.BooleanField(default=False)

    def __str__(self):
        return str(self.name)
    @property
    def createdAt(self):
        original_date = str(self.created_at)
        parsed_date = datetime.fromisoformat(original_date)

        # new_date = parsed_date.strftime("%Y-%m-%d %H:%M:%S")
        new_date = parsed_date.strftime("%Y-%m-%d")

        print(new_date)
        return new_date

class Conge(TimeStampedModel):

    title = models.CharField(max_length=255, null=True)
    start_date = models.DateField("date début de conge", null=True, blank=True)
    end_date = models.DateField("date fin de conge", null=True, blank=True)
    conge_start_time = models.TimeField("Heure debut de conge", null=True, blank=True)
    conge_end_time = models.TimeField("Heure fin de conge", null=True, blank=True)
    reason=models.ForeignKey(CongeType, blank=True,
                             null=True, on_delete=models.CASCADE)
    status =  models.CharField(max_length=20, choices=Status_CHOICES, default="En_cours")
    user = models.ForeignKey(UserAccount, to_field='id',on_delete=models.CASCADE, blank=True, null=True)
    
    @property
    def createdAt(self):
        original_date = str(self.created_at)
        parsed_date = datetime.fromisoformat(original_date)

        # new_date = parsed_date.strftime("%Y-%m-%d %H:%M:%S")
        new_date = parsed_date.strftime("%Y-%m-%d")

        print(new_date)
        return new_date