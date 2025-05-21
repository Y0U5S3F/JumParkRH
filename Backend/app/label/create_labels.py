from employe.models import Employe
from label.models import Label, LabelData
from django.utils import timezone

employees = Employe.objects.all()

for employee in employees:
    label = Label(
        employe=employee,
        service=employee.service,
        title=f"{employee.nom} {employee.prenom}",
        subtitle=employee.service.nom
    )
    label.save()
    label_data = LabelData(
        label=label,
        start_date=timezone.now(),
        end_date=timezone.now(),
        occupancy=0,
        title="Default Title",
        subtitle="Default Subtitle",
        description="Default Description",
        bg_color="#FFFFFF",
        start_pause=timezone.now(),
        end_pause=timezone.now()
    )
    label_data.save()

print("Labels created for all employes")
