from django.db import models

class Appareil(models.Model):
    STATUS_CHOICES = [
        ('Connecte', 'Connecté'),
        ('Non Connecte', 'Non Connecté'),
    ]

    nom = models.CharField(max_length=100, verbose_name="Nom")
    ip = models.GenericIPAddressField(verbose_name="Adresse IP", unique=True)
    port = models.IntegerField(verbose_name="Port")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Créé le")
    status = models.CharField(
        max_length=20, 
        choices=STATUS_CHOICES, 
        default='Non Connecte', 
        verbose_name="Statut", 
        db_index=True
    )

    class Meta:
        verbose_name = "Appareil"
        verbose_name_plural = "Appareils"
        ordering = ['-created_at']
        constraints = [
            models.UniqueConstraint(fields=['ip', 'port'], name='unique_ip_port')
        ]

    def __str__(self):
        return f"{self.nom} ({self.ip}:{self.port})"
