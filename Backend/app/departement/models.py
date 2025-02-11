from django.db import models

class Departement(models.Model):
    nom = models.CharField(max_length=100, unique=True, verbose_name="Nom du Département")

    class Meta:
        ordering = ['nom']  # Sort departments alphabetically
        verbose_name = "Département"
        verbose_name_plural = "Départements"
        indexes = [
            models.Index(fields=['nom']),  # Speeds up lookups by department name
        ]

    def __str__(self):
        return self.nom
