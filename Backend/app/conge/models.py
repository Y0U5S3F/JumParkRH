from django.db import models
from employe.models import Employe
from typeconge.models import TypeConge

class Conge(models.Model):
    STATUS_CHOICES = [
        ('en cours', 'En Cours'),
        ('accepte', 'Accepté'),
        ('refuse', 'Refusé'),
    ]

    employe = models.ForeignKey(Employe, on_delete=models.PROTECT, related_name="conges", verbose_name="Employé")
    typeconge = models.ForeignKey(TypeConge, on_delete=models.PROTECT, related_name="conges", verbose_name="Type de Congé")
    start_date = models.DateField(null=False, blank=False, verbose_name="Date de Début")
    end_date = models.DateField(null=False, blank=False, verbose_name="Date de Fin")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, verbose_name="Statut")
    notes = models.TextField(blank=True, verbose_name="Notes")

    class Meta:
        ordering = ['start_date']
        verbose_name = "Congé"
        verbose_name_plural = "Congés"

    def __str__(self):
        return f"{self.employe} - {self.typeconge} ({self.start_date} → {self.end_date})"
