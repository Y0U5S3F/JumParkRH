from django.db import models
from core.models import TimeStampedModel
from datetime import datetime

# Create your models here.

class Device(TimeStampedModel):
    name=models.CharField(max_length=255)
    ip=models.CharField(max_length=255,blank=True, null=True)
    port= models.CharField(max_length=255,blank=True, null=True)
    model=models.CharField(max_length=255, blank=True, null=True)
    is_admin = models.BooleanField(default=False, blank=True, null=True)
    
    def __str__(self):
        return self.name

    @property
    def createdAt(self):
        original_date = str(self.created_at)
        parsed_date = datetime.fromisoformat(original_date)

        # new_date = parsed_date.strftime("%Y-%m-%d %H:%M:%S")
        new_date = parsed_date.strftime("%Y-%m-%d")

        print(new_date)
        return new_date