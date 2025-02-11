from django.db import models
from employe.models import Employe

class Absence(models.Model):
    nom = models.CharField(max_length=100, unique=True)
    date = models.DateField(null=True, blank=True, verbose_name="Date de Naissance")
    raison = models.CharField(max_length=255, null=True, blank=True, verbose_name="Adresse")
    certifie = models.BooleanField(default=False, verbose_name="Certifié")

    employe = models.ForeignKey(
        Employe,
        on_delete=models.PROTECT,
        verbose_name="Employé",
        related_name="absences"
    )

    class Meta:
        ordering = ['-date']
        verbose_name = "Absence"
        verbose_name_plural = "Absences"
        constraints = [
            models.UniqueConstraint(fields=['employe', 'date'], name='unique_employe_date')
        ]
        indexes = [
            models.Index(fields=['date']),
            models.Index(fields=['employe']),
        ]

    def __str__(self):
        return f"Absence of {self.employe} on {self.date}"
