from django.db import models
from core.models import TimeStampedModel

# Create your models here.

class Society(TimeStampedModel):
    name=models.CharField(max_length=255)
    email=models.CharField(max_length=255,blank=True, null=True)
    phone= models.EmailField(max_length=255,blank=True, null=True)
    adress=models.CharField(max_length=255, blank=True, null=True)
    is_active = models.BooleanField(default=False, blank=True, null=True)
    
    def __str__(self):
        return self.name