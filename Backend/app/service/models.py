from django.db import models
from departement.models import Departement

class Service(models.Model):
    nom = models.CharField(max_length=100, unique=True, verbose_name="Nom du Service")
    departement = models.ForeignKey(
        Departement, 
        on_delete=models.CASCADE, 
        related_name="services", 
        verbose_name="Département"
    )

    class Meta:
        ordering = ['nom']
        verbose_name = "Service"
        verbose_name_plural = "Services"
        constraints = [
            models.UniqueConstraint(fields=['nom', 'departement'], name='unique_service_per_departement')
        ]
        indexes = [
            models.Index(fields=['nom']),
            models.Index(fields=['departement']),
        ]

    def __str__(self):
        return f"{self.nom} ({self.departement.nom})"
