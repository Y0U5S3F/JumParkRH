from django.db import models
from core.models import TimeStampedModel

class Holiday(TimeStampedModel):
    name=models.CharField(max_length=255, null=True, blank=True)
    start_date=models.DateField("date de début", null=True, blank=True)
    end_date=models.DateField("date de fin", null=True, blank=True)
 
    def __str__(self):
       return self.name