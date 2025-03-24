from django.db import models
from employe.models import Employe

class Salaire(models.Model):
    MODE_PAIEMENT_CHOICES = [
        ("virement bancaire", "Virement Bancaire"),
        ("cheque", "Cheque"),
        ("especes", "Especes"),
    ]

    employe = models.ForeignKey(
        Employe, 
        on_delete=models.CASCADE, 
        related_name="salaires", 
        verbose_name="Employé"
    )
    # Changed from a ForeignKey to a DecimalField to store the numeric salary base
    salaire_base = models.DecimalField(max_digits=15, decimal_places=5, verbose_name="Salaire de Base")
    jour_heure_travaille = models.DecimalField(max_digits=5, decimal_places=2, default=0.00, verbose_name="Jour/Heure travaillé")
    salaire = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Salaire")
    taux_heure_sup = models.DecimalField(max_digits=5, decimal_places=2, default=0.00, verbose_name="Taux horaire des heures sup")
    heures_sup = models.DecimalField(max_digits=5, decimal_places=2, default=0.00, verbose_name="Heures supplémentaires")
    prix_tot_sup = models.DecimalField(max_digits=10, decimal_places=2, default=0.00, verbose_name="Prix total des heures sup")
    prime_transport = models.DecimalField(max_digits=10, decimal_places=2, default=0.00, verbose_name="Prime de transport")
    prime_presence = models.DecimalField(max_digits=10, decimal_places=2, default=0.00, verbose_name="Prime de présence")
    acompte = models.DecimalField(max_digits=10, decimal_places=2, default=0.00, verbose_name="Acompte")
    impots = models.DecimalField(max_digits=10, decimal_places=2, default=0.00, verbose_name="Impôts")
    appointplus = models.DecimalField(max_digits=10, decimal_places=2, default=0.00, verbose_name="Apoint +")
    appointmoins = models.DecimalField(max_digits=10, decimal_places=2, default=0.00, verbose_name="Apoint -")
    css = models.DecimalField(max_digits=10, decimal_places=2, default=0.00, verbose_name="CSS")
    cnss = models.DecimalField(max_digits=10, decimal_places=2, default=0.00, verbose_name="CNSS")
    
    # Jours fériés
    jour_ferie = models.IntegerField(default=0, verbose_name="Jours fériés")
    prix_jour_ferie = models.DecimalField(max_digits=10, decimal_places=2, default=0.00, verbose_name="Prix jour férié")
    prix_tot_ferie = models.DecimalField(max_digits=10, decimal_places=2, default=0.00, verbose_name="Prix total des jours férié")

    # Congés payés
    conge_paye = models.IntegerField(default=0, verbose_name="Congés payés")
    jour_abcense = models.IntegerField(default=0, verbose_name="Jours d'absence")
    prix_conge_paye = models.DecimalField(max_digits=10, decimal_places=2, default=0.00, verbose_name="Prix congé payé")
    prix_tot_conge = models.DecimalField(max_digits=10, decimal_places=2, default=0.00, verbose_name="Prix total des conges payés")

    salaire_brut = models.DecimalField(max_digits=10, decimal_places=2, default=0.00, verbose_name="Salaire brut")
    salaire_imposable = models.DecimalField(max_digits=10, decimal_places=2, default=0.00, verbose_name="Salaire imposable")
    salaire_net = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Salaire net", blank=True, null=True)

    mode_paiement = models.CharField(max_length=20, choices=MODE_PAIEMENT_CHOICES, default="virement bancaire", verbose_name="Mode de paiement")

    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Date de création")

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.employe.nom} - {self.salaire_net}€"