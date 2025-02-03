from django.db import models

# Create your models here.

class CronError(models.Model):
    cron_type = models.CharField(max_length=255)
    error_message = models.TextField()
    error_date = models.DateTimeField(auto_now_add=True)
    duration = models.DurationField(blank=True, null=True)
    is_resolved = models.BooleanField(default=False)
    status = models.BooleanField(default=False)

    def __str__(self):
        return self.cron_type