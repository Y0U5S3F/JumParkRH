from django.db import models
from employe.models import Employe

class Attendance(models.Model):
    STATUS_CHOICES = [
        ('pause', 'Pause'),
        ('present', 'Présent'),
        ('conge', 'Congé'),
        ('absent', 'Absent'),
        ('fin de service', 'Fin de Service'),
        ('anomalie', 'Anomalie'),
    ]

    employe = models.ForeignKey(Employe, on_delete=models.CASCADE, related_name="pointages", verbose_name="Employé")
    date = models.DateField(null=False, blank=False, verbose_name="Date")
    heure_arrivee = models.TimeField(null=True, blank=True, verbose_name="Heure d'Arrivée")
    heure_depart = models.TimeField(null=True, blank=True, verbose_name="Heure de Départ")
    pause_debut = models.TimeField(null=True, blank=True, verbose_name="Début de Pause")
    pause_fin = models.TimeField(null=True, blank=True, verbose_name="Fin de Pause")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='present', verbose_name="Statut")
    heures_supplementaires = models.TimeField(null=True, blank=True, verbose_name="Heures Supplémentaires")

    class Meta:
        ordering = ['date', 'heure_arrivee']
        verbose_name = "Attendance"
        verbose_name_plural = "Attendances"

    def __str__(self):
        return f"{self.employe} - {self.date} - {self.status}"
