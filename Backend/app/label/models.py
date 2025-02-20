import uuid
from django.db import models

class Label(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    icon = models.URLField()
    title = models.CharField(max_length=255)
    subtitle = models.CharField(max_length=255)

class LabelData(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    label = models.ForeignKey(Label, related_name="data", on_delete=models.CASCADE)  # Many-to-One relationship
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    occupancy = models.IntegerField()
    title = models.CharField(max_length=255)
    subtitle = models.CharField(max_length=255)
    description = models.TextField()
    bg_color = models.CharField(max_length=20)
