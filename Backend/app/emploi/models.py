# filepath: /home/youfi/Documents/Projects/JumpParkRH/Backend/app/emploi/models.py
from django.db import models
from employe.models import Employe

class Emploi(models.Model):
    JOURS_CHOICES = [
        ('lundi', 'Lundi'),
        ('mardi', 'Mardi'),
        ('mercredi', 'Mercredi'),
        ('jeudi', 'Jeudi'),
        ('vendredi', 'Vendredi'),
        ('samedi', 'Samedi'),
        ('dimanche', 'Dimanche'),
    ]

    employe = models.ForeignKey(Employe, on_delete=models.CASCADE, verbose_name="Employe", related_name="emplois")
    heure_depart = models.TimeField()
    heure_arrivee = models.TimeField()
    pause_debut = models.TimeField()
    pause_fin = models.TimeField()
    jour = models.CharField(max_length=10, choices=JOURS_CHOICES)

    def __str__(self):
        return f"{self.employe} - {self.jour}"