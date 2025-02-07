from django.db import models
from departement.models import Departement

class Service(models.Model):
    nom = models.CharField(max_length=100, unique=True)
    departement = models.ForeignKey(Departement,on_delete=models.PROTECT,null=False,blank=False,related_name="services",verbose_name="Département")

    def __str__(self):
        return self.nom
    