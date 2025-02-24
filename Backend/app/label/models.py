# label/models.py
import uuid
from django.db import models

class Label(models.Model):
    id = models.AutoField(primary_key=True)
    employe = models.ForeignKey(
        "employe.Employe", 
        on_delete=models.CASCADE,
        verbose_name="Employe", 
        related_name="labels"
    )
    service = models.ForeignKey(
        "service.Service", 
        on_delete=models.PROTECT, 
        verbose_name="Service", 
        related_name="labels"
    )
    title = models.CharField(max_length=255)
    subtitle = models.CharField(max_length=255)

    def save(self, *args, **kwargs):
        if self.employe:
            self.title = f"{self.employe.nom} {self.employe.prenom}"
            self.service = self.employe.service
            self.subtitle = self.employe.service.nom
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.title} - {self.subtitle}"

    class Meta:
        verbose_name = "Label"
        verbose_name_plural = "Labels"
        unique_together = ('employe',)


class LabelData(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    label = models.ForeignKey(Label, related_name="data", on_delete=models.CASCADE)
    startDate = models.DateTimeField()
    endDate = models.DateTimeField()
    occupancy = models.IntegerField()
    title = models.CharField(max_length=255)
    subtitle = models.CharField(max_length=255)
    description = models.TextField()
    bg_color = models.CharField(max_length=20)
    startPause = models.DateTimeField()
    endPause = models.DateTimeField()
