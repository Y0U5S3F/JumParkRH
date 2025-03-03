from django.db.models.signals import post_save
from django.dispatch import receiver
from django.apps import apps
from .models import Employe

@receiver(post_save, sender=Employe)
def create_label_for_employe(sender, instance, created, **kwargs):
    if created:
        LabelModel = apps.get_model('label', 'Label')
        LabelModel.objects.create(
            employe=instance,
            uid=instance.uid,
            title=f"{instance.nom} {instance.prenom}",
            subtitle = f"UID: {instance.uid}"
        )
