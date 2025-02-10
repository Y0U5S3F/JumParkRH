from django.db import models
from employe.models import Employe

class Absence(models.Model):
    nom = models.CharField(max_length=100, unique=True)
    date = models.DateField(null=True, blank=True, verbose_name="Date de Naissance")
    raison = models.CharField(max_length=255, null=True, blank=True, verbose_name="Adresse")
    certifie = models.BooleanField(default=False, verbose_name="Certifié")


    employe = models.ForeignKey(Employe,on_delete=models.PROTECT,null=False,blank=False,verbose_name="Employe",related_name="Absences",)

    def __str__(self):
        return f"Absence of {self.employe} on {self.date}"