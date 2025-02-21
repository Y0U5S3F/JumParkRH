from django.db import models

class TypeConge(models.Model):
    nom = models.CharField(max_length=100,unique=True,verbose_name="Type de Congé")

    class Meta:
        verbose_name = "Type de Congé"
        verbose_name_plural = "Types de Congé"

    def __str__(self):
        return self.nom