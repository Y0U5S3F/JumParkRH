import datetime
from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from .models import Conge
from label.models import Label, LabelData

@receiver(post_save, sender=Conge)
def add_label_data_for_conge(sender, instance, created, **kwargs):
    if created and instance.status == "accepte":
        try:
            label = Label.objects.get(employe=instance.employe)
        except Label.DoesNotExist:
            print(f"No label found for employe {instance.employe}")
            return

        try:
            num_days = (instance.endDate - instance.startDate).days
            for day_offset in range(num_days):
                day_date = instance.startDate + datetime.timedelta(days=day_offset)
                start_datetime = datetime.datetime.combine(day_date, datetime.time(hour=8, minute=0))
                end_datetime = datetime.datetime.combine(day_date, datetime.time(hour=17, minute=0))
                
                LabelData.objects.create(
                    label=label,
                    startDate=start_datetime,
                    endDate=end_datetime,
                    startPause=None,
                    endPause=None,
                    status="en conge"
                )
        except Exception as e:
            print("Error creating LabelData:", e)

@receiver(pre_save, sender=Conge)
def handle_conge_status_change(sender, instance, **kwargs):
    if not instance.pk:
        return

    try:
        previous = Conge.objects.get(pk=instance.pk)
    except Conge.DoesNotExist:
        return

    if previous.status == "en cours" and instance.status == "accepte":
        try:
            label = Label.objects.get(employe=instance.employe)
        except Label.DoesNotExist:
            print(f"No label found for employe {instance.employe}")
            return

        try:
            num_days = (instance.endDate - instance.startDate).days
            for day_offset in range(num_days):
                day_date = instance.startDate + datetime.timedelta(days=day_offset)
                start_datetime = datetime.datetime.combine(day_date, datetime.time(hour=8, minute=0))
                end_datetime = datetime.datetime.combine(day_date, datetime.time(hour=17, minute=0))

                LabelData.objects.create(
                    label=label,
                    startDate=start_datetime,
                    endDate=end_datetime,
                    startPause=None,
                    endPause=None,
                    status="en conge"
                )
        except Exception as e:
            print("Error creating LabelData during status update:", e)