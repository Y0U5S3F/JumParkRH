import datetime
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Absence
from label.models import Label, LabelData

@receiver(post_save, sender=Absence)
def add_label_data_for_absence(sender, instance, created, **kwargs):
    if created:
        try:
            # Retrieve the Label associated with the employee
            label = Label.objects.get(employe=instance.employe)
        except Label.DoesNotExist:
            print(f"No label found for employe {instance.employe}")
            return

        try:
            if instance.date:
                # Create start and end datetime objects with specified times
                start_datetime = datetime.datetime.combine(instance.date, datetime.time(hour=8, minute=0))
                end_datetime = datetime.datetime.combine(instance.date, datetime.time(hour=17, minute=0))
            else:
                start_datetime = None
                end_datetime = None

            # Create a new LabelData entry with status "absent"
            LabelData.objects.create(
                label=label,
                startDate=start_datetime,
                endDate=end_datetime,
                startPause=None,
                endPause=None,
                status="absent"
            )
        except Exception as e:
            print("Error creating LabelData for Absence:", e)
