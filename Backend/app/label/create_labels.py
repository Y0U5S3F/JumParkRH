from employe.models import Employe
from label.models import Label, LabelData
from django.utils import timezone

# Fetch all employees
employees = Employe.objects.all()

for employee in employees:
    # Create a label for each employee
    label = Label(
        employe=employee,
        service=employee.service,  # Assuming 'service' is related to 'employe'
        title=f"{employee.nom} {employee.prenom}",
        subtitle=employee.service.nom  # Assuming 'service' has a 'nom' field
    )
    label.save()
    # Optionally, create associated LabelData entries
    label_data = LabelData(
        label=label,
        start_date=timezone.now(),
        end_date=timezone.now(),  # Adjust as needed
        occupancy=0,
        title="Default Title",  # Modify accordingly
        subtitle="Default Subtitle",
        description="Default Description",
        bg_color="#FFFFFF",  # Set default bg_color
        start_pause=timezone.now(),
        end_pause=timezone.now()
    )
    label_data.save()

print("Labels created for all employes")
