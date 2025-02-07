from django.db import models

class Departement(models.Model):
    nom = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.nom