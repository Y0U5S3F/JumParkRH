import datetime
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import JourFerie
from label.models import Label, LabelData

@receiver(post_save, sender=JourFerie)
def add_label_data_for_jour_ferie(sender, instance, created, **kwargs):
    if created:
        try:
            labels = Label.objects.all()

            for label in labels:
                start_datetime = datetime.datetime.combine(instance.date, datetime.time(hour=8, minute=0))
                end_datetime = datetime.datetime.combine(instance.date, datetime.time(hour=17, minute=0))

                LabelData.objects.create(
                    label=label,
                    startDate=start_datetime,
                    endDate=end_datetime,
                    startPause=None,
                    endPause=None,
                    status="jour ferie"
                )
        except Exception as e:
            print("Error creating LabelData for JourFerie:", e)
