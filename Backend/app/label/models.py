import uuid
from django.db import models
from django.utils.timezone import now
from jourferie.models import JourFerie

class Label(models.Model):
    id = models.AutoField(primary_key=True)
    employe = models.ForeignKey(
        "employe.Employe", 
        on_delete=models.CASCADE,
        verbose_name="Employe", 
        related_name="labels"
    )
    uid = models.PositiveIntegerField(blank=True, null=True, verbose_name="UID")
    title = models.CharField(max_length=255)
    subtitle = models.CharField(max_length=255)

    def save(self, *args, **kwargs):
        if self.employe:
            self.title = f"{self.employe.nom} {self.employe.prenom}"
            self.uid = self.employe.uid  
            self.subtitle = f"UID: {self.employe.uid}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.title} - {self.subtitle}"

    class Meta:
        verbose_name = "Label"
        verbose_name_plural = "Labels"
        unique_together = ('employe',)


class LabelData(models.Model):
    STATUS_CHOICES = [
        ("present", "Présent"),
        ("en pause", "En Pause"),
        ("en conge", "En Congé"),
        ("absent", "Absent"),
        ("fin de service", "Fin de Service"),
        ("anomalie", "Anomalie"),
        ("jour ferie", "Jour Férié"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    label = models.ForeignKey(Label, related_name="data", on_delete=models.CASCADE)
    startDate = models.DateTimeField()
    endDate = models.DateTimeField()
    startPause = models.DateTimeField()
    endPause = models.DateTimeField()
    status = models.CharField(max_length=30, choices=STATUS_CHOICES);

    def __str__(self):
        return f"{self.label.title} - {self.status} ({self.startDate})"