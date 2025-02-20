from django.db import models
from employe.models import Employe

class Conge(models.Model):
    TYPE_CONGE_CHOICES = [
        ('conge paye', 'Congé Payé'),
        ('conge sans solde', 'Congé Sans Solde'),
        ('conge maladie', 'Congé Maladie'),
        ('conge maternite', 'Congé Maternité'),
        ('conge paternite', 'Congé Paternité'),
        ('conge exceptionnel', 'Congé Exceptionnel'),
        ('conge annuel', 'Congé Annuel'),
    ]

    STATUS_CHOICES = [
        ('en cours', 'En Cours'),
        ('accepte', 'Accepté'),
        ('refuse', 'Refusé'),
    ]

    employe = models.ForeignKey(Employe, on_delete=models.PROTECT, related_name="conges", verbose_name="Employé")
    type_conge = models.CharField(max_length=50, choices=TYPE_CONGE_CHOICES, verbose_name="Type de Congé")
    start_date = models.DateField(null=False, blank=False, verbose_name="Date de Début")
    end_date = models.DateField(null=False, blank=False, verbose_name="Date de Fin")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, verbose_name="Statut")
    notes = models.TextField(blank=True, verbose_name="Notes")

    class Meta:
        ordering = ['start_date']
        verbose_name = "Congé"
        verbose_name_plural = "Congés"

    def __str__(self):
        return f"{self.employe} - {self.type_conge} ({self.start_date} → {self.end_date})"
