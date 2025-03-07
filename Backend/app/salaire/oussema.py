from django.db import models
from employe.models import Employe

class Salaire(models.Model):
    MODE_PAIEMENT_CHOICES = [
        ("virement bancaire", "Virement Bancaire"),
        ("cheque", "Cheque"),
        ("especes", "Especes"),
    ]

    employe = models.ForeignKey(Employe, on_delete=models.CASCADE, related_name="salaires", verbose_name="Employé")
    salaire_base = models.ForeignKey(Employe, on_delete=models.CASCADE, to_field="salaire_base", verbose_name="Salaire de base")
    jour_heure_travaille = models.DecimalField(max_digits=5, decimal_places=2, default=0.00, verbose_name="Jour/Heure travaillé")
    salaire = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Salaire")
    taux_heure_sup = models.DecimalField(max_digits=5, decimal_places=2, default=0.00, verbose_name="Taux horaire des heures sup")
    heures_sup = models.DecimalField(max_digits=5, decimal_places=2, default=0.00, verbose_name="Heures supplémentaires")
    prix_tot_sup = models.DecimalField(max_digits=10, decimal_places=2, default=0.00, verbose_name="Prix total des heures sup")
    prime_transport = models.DecimalField(max_digits=10, decimal_places=2, default=0.00, verbose_name="Prime de transport")
    prime_presence = models.DecimalField(max_digits=10, decimal_places=2, default=0.00, verbose_name="Prime de présence")
    acompte = models.DecimalField(max_digits=10, decimal_places=2, default=0.00, verbose_name="Acompte")
    impots = models.DecimalField(max_digits=10, decimal_places=2, default=0.00, verbose_name="Impôts")
    apoint = models.DecimalField(max_digits=10, decimal_places=2, default=0.00, verbose_name="Apoint")
    css = models.DecimalField(max_digits=10, decimal_places=2, default=0.00, verbose_name="CSS")
    cnss = models.DecimalField(max_digits=10, decimal_places=2, default=0.00, verbose_name="CNSS")
    
    # Jours fériés (nombre de jours)
    jour_ferie = models.IntegerField(default=0, verbose_name="Jours fériés")
    prix_jour_ferie = models.DecimalField(max_digits=10, decimal_places=2, default=0.00, verbose_name="Prix jour férié")
    prix_tot_ferie = models.DecimalField(max_digits=10, decimal_places=2, default=0.00, verbose_name="Prix total des jours férié")

    # Congés payés (nombre de jours)
    conge_paye = models.IntegerField(default=0, verbose_name="Congés payés")
    prix_conge_paye = models.DecimalField(max_digits=10, decimal_places=2, default=0.00, verbose_name="Prix congé payé")
    prix_tot_conge = models.DecimalField(max_digits=10, decimal_places=2, default=0.00, verbose_name="Prix total des conges payés")

    salaire_brut = models.DecimalField(max_digits=10, decimal_places=2, default=0.00, verbose_name="Salaire brut")
    salaire_imposable = models.DecimalField(max_digits=10, decimal_places=2, default=0.00, verbose_name="Salaire imposable")
    salaire_net = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Salaire net", blank=True, null=True)

    mode_paiement = models.CharField(max_length=20, choices=MODE_PAIEMENT_CHOICES, default="virement bancaire", verbose_name="Mode de paiement")

    def calculer_salaire(self):
        # Convert jour_heure_travaille to hours
        heure_travaille = float(self.jour_heure_travaille) * 8
        jour_travaille = int(self.jour_heure_travaille)
        taux_heure_base = float(self.salaire_base) / 208

        if heure_travaille < 208:
            heures_manquantes = 208 - heure_travaille
            self.salaire = self.salaire_base - (heures_manquantes * taux_heure_base)
        elif heure_travaille > 208:
            heures_sup = heure_travaille - 208
            self.heures_sup = heures_sup
            self.prix_tot_sup = heures_sup * self.taux_heure_sup
            self.salaire = self.salaire_base + self.prix_tot_sup
        else:
            self.salaire = self.salaire_base

        # Prime de présence & transport
        self.prime_presence = jour_travaille * (13.339 / jour_travaille) if jour_travaille > 0 else 0
        self.prime_transport = jour_travaille * (71.253 / jour_travaille) if jour_travaille > 0 else 0
        
        # Jours fériés & Congés payés
        self.prix_tot_ferie = self.jour_ferie * self.prix_jour_ferie
        self.prix_tot_conge = self.conge_paye * self.prix_conge_paye
        
        # Calcul du salaire brut
        self.salaire_brut = self.salaire + self.prime_presence + self.prime_transport + self.prix_tot_ferie + self.prix_tot_conge
        
        # CNSS & CSS
        self.cnss = self.salaire_brut * 0.0968
        self.salaire_imposable = self.salaire_brut - self.cnss
        self.css = self.salaire_imposable * 0.005
        
        # Salaire Net
        self.salaire_net = self.salaire_imposable - (self.acompte + self.impots + self.apoint + self.css)

    def save(self, *args, **kwargs):
        self.calculer_salaire()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.employe.nom} - {self.salaire_net}€"