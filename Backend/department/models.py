from django.db import models
from core.models import TimeStampedModel
from datetime import datetime

# Create your models here.
class Department(TimeStampedModel):
    name=models.CharField(max_length=255)
    phone=models.CharField(max_length=255,blank=True, null=True)
    email= models.EmailField(max_length=255,blank=True, null=True)
    longitude=models.CharField(max_length=255, blank=True, null=True)
    latitude=models.CharField(max_length=255, blank=True, null=True)
      
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