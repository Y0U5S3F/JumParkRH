from django.db import models
from employe.models import Employe

class Salaire(models.Model):
    STATUS_CHOICES = [
        ('traité', 'Traité'),
        ('en attente', 'En attente'),
    ]

    employe_id = models.ForeignKey(Employe, on_delete=models.CASCADE, related_name='salaires')
    salary = models.DecimalField(max_digits=10, decimal_places=2)
    month = models.CharField(max_length=20)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='en attente')

    def __str__(self):
        return f"{self.employe_id} - {self.month} - {self.status}"


