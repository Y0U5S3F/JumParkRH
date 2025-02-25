# label/models.py
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

    def save(self, *args, **kwargs):
        today = now().date()
        previous_status = self.status

        if JourFerie.objects.filter(date=today).exists():
            self.status = "jour ferie"

        if self.status == "present" and self.endDate and today > self.endDate.date():
            self.status = "fin de service"

        elif (self.startPause is None) != (self.endPause is None):  
            self.status = "en pause"

        elif self.status == "absent":
            employe = self.label.employe
            if employe and employe.conges.filter(
                status="accepte",
                startDate__lte=today,
                endDate__gte=today
            ).exists():
                self.status = "en conge"

        else:
            self.status = "anomalie"

        if previous_status != self.status and self.status == "anomalie":
            print(f"Anomalie detected for {self.label.title} on {self.startDate}")

        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.label.title} - {self.status} ({self.startDate})"