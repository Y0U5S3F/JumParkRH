from django.db import models
from core.models import TimeStampedModel

from datetime import datetime, timedelta 
from department.models import Department
from django.contrib.auth import get_user_model

User = get_user_model()
# Create your models here.

    
class TypeWork(TimeStampedModel):
    types = [
        ('Flexible schedule', 'Flexible schedule'),
        ('Fixed schedule', 'Fixed schedule'),
    ]
    name = models.CharField(max_length=100, blank=True, null=True)
    type = models.CharField(
        max_length=100, choices=types, blank=True, null=True)
    start_time_work = models.TimeField(blank=True, null=True)
    start_time_break = models.TimeField(blank=True, null=True)
    end_time_break = models.TimeField(blank=True, null=True)
    end_time_work = models.TimeField(blank=True, null=True)


    def __str__(self):
        return self.name
    
    
class WorkTime(TimeStampedModel):

    period = models.CharField(max_length=100, blank=True, null=True)
    start_date = models.DateField(blank=True, null=True)
    end_date = models.DateField(blank=True, null=True)
    number_hours = models.TimeField(blank=True, null=True)
    type = models.ForeignKey(
        TypeWork, on_delete=models.CASCADE, blank=True, null=True)
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, null=True, blank=True)
    def __str__(self):
        return self.period
    
    
    
    
# -------------------------------------New configurations ----------------------

class OverlapPeriodType(models.Model):
    name = models.CharField(max_length=100)
    
    DEFAULT_OVERLAP_PERIOD = [
        {'name': 'Fixed schedule', },
    ]
    def __str__(self):
        return self.name
class OverlapPeriod(TimeStampedModel):
    start_date = models.DateField(blank=True, null=True)
    end_date = models.DateField(blank=True, null=True)
    delay = models.TimeField(blank=True, null=True)
    default= models.BooleanField(default=False, blank=True)
    schedule_type = models.ForeignKey(OverlapPeriodType, on_delete=models.CASCADE, blank=True,null=True,)
    department = models.ForeignKey(Department, on_delete=models.CASCADE, null=True, blank=True)
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, null=True, blank=True)
    def __str__(self):
        return f'{self.schedule_type} - {self.user}'


# days of week
class ConfigurationDays(TimeStampedModel):
    days = [
        ("Monday", "Monday"),
        ("Tuesday", "Tuesday"),
        ("Wednesday", "Wednesday"),
        ("Thursday", "Thursday"),
        ("Friday", "Friday"),
        ("Saturday", "Saturday"),
        ("Sunday", "Sunday"),
    ]
    # DEFAULT_CONFIGURATION_DAYS = [
    #     ("Monday", "Monday"),
    #     ("Tuesday", "Tuesday"),
    #     ("Wednesday", "Wednesday"),
    #     ("Thursday", "Thursday"),
    #     ("Friday", "Friday"),
    #     ("Saturday", "Saturday"),
    #     ("Sunday", "Sunday"),
    # ]
    weekday = models.CharField(
        choices=days, max_length=255, blank=True, null=True)
    start_at = models.TimeField(blank=True, null=True)
    end_at = models.TimeField(blank=True, null=True)
    break_duration = models.TimeField(blank=True, null=True)
    duration = models.TimeField(max_length=255 ,blank=True, null=True)
    
    overlap_period = models.ForeignKey(
            OverlapPeriod, on_delete=models.CASCADE, null=True, blank=True)
    # duration_in_seconds:3600
    def __str__(self):
        return self.weekday
    
    @property
    def get_duration(self):
        if self.start_at and self.end_at:
            start = datetime.combine(datetime.today(), self.start_at)
            end = datetime.combine(datetime.today(), self.end_at)
            if start <= end:
                duration = end - start
            else:
                duration = timedelta(days=1) - (start - end)
            return duration.total_seconds() / 3600
        return None
    # @property
    # def duration(self):
        
    #     start_at = self.start_at
    #     end_at = self.end_at
    #     duration =  end_at - start_at
    #     return duration
    
    class Meta:
            ordering = ['id']

class Schedule(TimeStampedModel):

    name = models.CharField(
        max_length=255, blank=True, null=True)
    periods = models.ManyToManyField(OverlapPeriod)
    # employes = models.ManyToManyField(Employes)
    # campany = models.ForeignKey(
        # Campany, on_delete=models.CASCADE, null=True, blank=True)
    def __str__(self):
        return self.name





class Day(TimeStampedModel):
    DAY_CHOICES = (
        ('Monday', 'Monday'),
        ('Tuesday', 'Tuesday'),
        ('Wednesday', 'Wednesday'),
        ('Thursday', 'Thursday'),
        ('Friday', 'Friday'),
        ('Saturday', 'Saturday'),
        ('Sunday', 'Sunday'),
    )
    name = models.CharField(max_length=255 ,choices=DAY_CHOICES, blank=True, null=True )

    DEFAULT_DAY = [
        {'name': 'Monday', },
        {'name': 'Tuesday', },
        {'name': 'Wednesday', },
        {'name': 'Thursday', },
        {'name': 'Friday', },
        {'name': 'Saturday', },
        {'name': 'Sunday', },
    ]

    def __str__(self):
        return str(self.name)
    class Meta:
        ordering = ['id']

class WeeklySchedule(TimeStampedModel):
    employee = models.ForeignKey(User, on_delete=models.CASCADE)
    week_name = models.CharField(max_length=250)
    start_date_of_week = models.DateField(blank=True)
    end_date_of_week = models.DateField(blank=True)
    
    def __str__(self):
        return str(self.week_name)
    class Meta:
        ordering = ['id']
class DaySchedule(TimeStampedModel):

    day = models.ForeignKey(Day, on_delete=models.CASCADE, blank=True, null=True)
    check_in = models.TimeField(blank=True, null=True)
    check_out = models.TimeField(blank=True, null=True)
    break_duration = models.TimeField(blank=True, null=True)
    duration = models.TimeField(max_length=255 ,blank=True, null=True)
    week_schedule = models.ForeignKey(WeeklySchedule, on_delete=models.CASCADE, blank=True, null=True)

    def __str__(self):
        return str(self.week_schedule.week_name)
    class Meta:
        ordering = ['id']