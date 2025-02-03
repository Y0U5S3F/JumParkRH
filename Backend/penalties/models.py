from django.db import models
from core.models import TimeStampedModel
from authentication.models import User
from colorfield.fields import ColorField

# Create your models here.

# punishment

class TypeWarning(TimeStampedModel):
    name = models.CharField(max_length=255, null=True, blank=True)
    color = ColorField(null=True, blank=True)
    maximum_number_alert = models.IntegerField(blank=True,null=True)

    def __str__(self):
        return str(self.name)
    
class Punishment(TimeStampedModel):
    user=models.ForeignKey(User, on_delete=models.CASCADE,blank=True,null=True)
    description=models.TextField(blank=True,null=True)
    warning_type=models.ForeignKey(TypeWarning, on_delete=models.CASCADE,blank=True,null=True)
    
    def __str__(self):
        return str(self.user)

