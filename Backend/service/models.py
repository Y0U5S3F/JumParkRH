from django.db import models
from core.models import TimeStampedModel
from datetime import datetime

class Service(TimeStampedModel):
    name= models.CharField(max_length=255, null=True, blank=True)
    
    def __str__(self):
        return self.name
    @property
    def createdAt(self):
        original_date = str(self.created_at)
        parsed_date = datetime.fromisoformat(original_date)
        new_date = parsed_date.strftime("%Y-%m-%d")

        print(new_date)
        return new_date