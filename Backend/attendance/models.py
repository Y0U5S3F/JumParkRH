from django.db import models
from authentication.models  import UserAccount
from datetime import *
from core.models import TimeStampedModel

# Create your models here.

class Delay(TimeStampedModel):
    employee = models.ForeignKey(UserAccount, to_field='id',on_delete=models.CASCADE, blank=True, null=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    duration = models.DurationField()
      
    def __str__(self):
       return self.employee.first_name

status = (
    ('Present', 'Present'),
    ('Absent', 'Absent'),
    ('Day Off', 'DayOff'),
    ('Conge', 'Conge'),
    ('Anomalie', 'Anomalie'),
)
class Attendance(TimeStampedModel):
    date = models.DateField("Date d'attendance", null=True, blank=True)
    checkin = models.TimeField("Heure d'arrivé", null=True, blank=True)
    checkout_pause = models.TimeField("Heure aprés pause", null=True, blank=True)
    checkin_pause = models.TimeField("Heure de pause",null=True, blank=True)
    checkout = models.TimeField("Heure de départ", null=True, blank=True)
    checkin_autorised = models.TimeField("Heure de debut abscence autorisé",null=True, blank=True)
    checkout_autorised = models.TimeField("Heure de fin abscence autorisé", null=True, blank=True)
    duration = models.CharField("Duration de travail",max_length=255, null=True, blank=True)
    additional_hours = models.CharField("Heures Supplémentaire", max_length=255, null=True, blank=True)
    # type_absence = models.CharField(max_length=255, null=True, blank=True)
    status=models.CharField(max_length=20, choices= status, blank=True, null=True)
    user = models.ForeignKey(UserAccount, to_field='id',on_delete=models.CASCADE, blank=True, null=True)
        
    def employee(self):
        return self.user.full_name
    def is_closed(self):
        return bool(self.checkin and self.checkout and self.checkin_pause and self.checkout_pause)

    is_closed.short_description = "Clôturé"
    is_closed.boolean = True

    def conTime(tt):
        tt = str(tt)
        h, m, s = [int(i) for i in tt.split(':')]
        return timedelta(hours=h, minutes=m, seconds=s)
    @property
    def get_status(self):
        checkin = self.checkin
        checkout = self.checkout
        # if self.status is None:
        #     status = ''
        if self.status == 'Conge': 
            status = 'Conge'
        elif self.status == 'Absent': 
            status = 'Absent'
        elif checkin  and checkout and self.status =='Present':
            status = 'Present'
        elif checkin is None  or checkout is None:
            status = 'Anomalie'
        else:
            status = 'Day Off'
        return status
    
    def calculate_overtime(self):
        if self.checkin and self.checkout and self.checkin < self.checkout:
            # Convertir les heures de checkin et checkout en objets datetime
            checkin_datetime = datetime.combine(self.date, self.checkin)
            checkout_datetime = datetime.combine(self.date, self.checkout)

            # Calculer la durée de travail
            work_duration = checkout_datetime - checkin_datetime

            # Calculer la durée des heures supplémentaires (supérieures à 8 heures)
            overtime_duration = max(work_duration - timedelta(hours=8), timedelta(0))

            # Convertir la durée des heures supplémentaires en heures et minutes
            overtime_hours, remainder = divmod(overtime_duration.seconds, 3600)
            overtime_minutes, _ = divmod(remainder, 60)

            return {
                'hours': overtime_hours,
                'minutes': overtime_minutes
            }
        else:
            return {
                'hours': 0,
                'minutes': 0
            }
    # Méthode pour calculer les jours de travail
    def calculate_workdays(self):
        if self.checkin and self.checkout:
            # Convertir les heures de checkin et checkout en objets datetime
            checkin_datetime = datetime.combine(self.date, self.checkin)
            checkout_datetime = datetime.combine(self.date, self.checkout)

            # Calculer la durée de travail en heures
            work_hours = (checkout_datetime - checkin_datetime).seconds / 3600

            # Calculer les jours de travail (chaque jour = 8 heures)
            workdays = work_hours / 8

            return workdays
        else:
            return 0
    # def calcul_duration(self, overTime):
    #     self.duration = str(time(0))
    #     self.additional_hours = str(time(0))
    #     if ((self.checkin != '00:00:00') and (self.checkout != '00:00:00') and (self.checkin_pause != '00:00:00') and (self.checkout_pause != '00:00:00')):
    #         self.checkin = Attendance.conTime(self.checkin)
    #         self.checkout = Attendance.conTime(self.checkout)
    #         self.checkin_pause = Attendance.conTime(self.checkin_pause)
    #         self.checkout_pause = Attendance.conTime(self.checkout_pause)

    #         before_pause = self.checkout_pause - self.checkin
    #         after_pause = self.checkout - self.checkin_pause
    #         dd = before_pause + after_pause
    #         dd = dd - overTime
    #         if dd > Attendance.conTime("08:00:00"):
    #             self.additional_hours, dd = str(dd - Attendance.conTime("08:00:00")), Attendance.conTime("08:00:00")
    #         self.checkin = str(self.checkin)
    #         self.checkout = str(self.checkout)
    #         self.checkin_pause = str(self.checkin_pause)
    #         self.checkout_pause = str(self.checkout_pause)
    #         self.duration = str(dd)
    #     # deux pointage
    #     if ((self.checkin != '00:00:00') and (self.checkout != '00:00:00') ):
    #         self.checkin = Attendance.conTime(self.checkin)
    #         self.checkout = Attendance.conTime(self.checkout)
       
    #         all = self.checkout - self.checkin
    #         all = all - overTime
    #         if all > Attendance.conTime("08:00:00"):
    #             self.additional_hours, all = str(all - Attendance.conTime("08:00:00")), Attendance.conTime("08:00:00")
    #         self.checkin = str(self.checkin)
    #         self.checkout = str(self.checkout)
    #         self.duration = str(all)    
        # if(self.checkout_pause and self.checkout):
        #     td = self.checkin_pause - self.checkin
        #     ts = self.checkout - self.checkout_pause
        #     s = td + ts     
        #     return ':'.join(str(s).split(':')[:2])
        # elif self.checkin_pause:
        #     td = self.checkin_pause - self.checkin 
        #     return ':'.join(str(td).split(':')[:2])
        # elif self.checkout:
        #     td = self.checkout - self.checkout_pause 
        #     return ':'.join(str(td).split(':')[:2])
        # else:
        #     return None

    duration.short_description = "Durée"
    @property
    def calcul_duration(self):
        if self.checkin and self.checkout:
            checkin = datetime.combine(datetime.today(), self.checkin)
            checkout = datetime.combine(datetime.today(), self.checkout)
            if checkin <= checkout:
                duration = checkout - checkin
            else:
                duration = timedelta(days=1) - (checkin - checkout)
            hours, remainder = divmod(duration.seconds, 3600)
            minutes, seconds = divmod(remainder, 60)
            duration_str = f"{hours:02d}:{minutes:02d}"
            return duration_str
        
        return 0

    @property
    def calcul_additional_hours(self):
        if self.calcul_duration:
            hours, minutes = map(int, self.calcul_duration.split(':'))
            duration_float = hours + minutes / 60
            duration_timedelta = timedelta(hours=duration_float)
            duration_string = str(duration_timedelta)
            if datetime.strptime(duration_string, "%H:%M:%S") > datetime.strptime("08:00:00", "%H:%M:%S"):
                additionalHours_duration = datetime.strptime(duration_string, "%H:%M:%S") - datetime.strptime("08:00:00", "%H:%M:%S")
                additionalHours = str(additionalHours_duration)
                hours, remainder = divmod(additionalHours_duration.seconds, 3600)
                minutes, seconds = divmod(remainder, 60)
                additionalHours = f"{hours:02d}:{minutes:02d}"
                return additionalHours
        return 0  

    def get_checkin_datetime(self):
        return datetime.combine(self.date, self.checkin)

    def get_checkout_datetime(self):
        return datetime.combine(self.date, self.checkout) if self.checkout else None