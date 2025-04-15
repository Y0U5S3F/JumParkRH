from django.db import models

class JourFerie(models.Model):

    nom = models.CharField(max_length=100, verbose_name="Nom")
    date = models.DateField(verbose_name="Date")

    class Meta:
        ordering = ['date']
        verbose_name = "Jour Férié"
        verbose_name_plural = "Jour Fériés"

    def __str__(self):
        return f"{self.nom} ({self.ip}:{self.port})"
