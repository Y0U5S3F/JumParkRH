import datetime
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Conge
from label.models import Label, LabelData

@receiver(post_save, sender=Conge)
def add_label_data_for_conge(sender, instance, created, **kwargs):
    # Only proceed if the Conge is newly created and its status is "accepte"
    if created and instance.status == "accepte":
        try:
            # Retrieve the Label associated with the employee
            label = Label.objects.get(employe=instance.employe)
        except Label.DoesNotExist:
            print(f"No label found for employe {instance.employe}")
            return  # Exit if no Label exists

        try:
            # Calculate the number of full days between startDate and endDate
            num_days = (instance.endDate - instance.startDate).days
            # Loop over each day in the conge interval
            for day_offset in range(num_days):
                day_date = instance.startDate + datetime.timedelta(days=day_offset)
                # Create start and end datetime objects for the day with specific times
                start_datetime = datetime.datetime.combine(day_date, datetime.time(hour=8, minute=0))
                end_datetime = datetime.datetime.combine(day_date, datetime.time(hour=17, minute=0))
                
                # Create a new LabelData entry for this day interval
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
