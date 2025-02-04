from django.contrib import admin
from import_export.admin import ImportExportModelAdmin
from .models import CronError
# Register your models here.


@admin.register(CronError)
class CronErrorAdmin(ImportExportModelAdmin,admin.ModelAdmin):
    list_display = (
        'id',
        'cron_type',
        'error_message',
        'error_date',
        'duration',
        'is_resolved',
        'status',
    )
    # list_filter = ('created_at', 'updated_at')
    # date_hierarchy = 'created_at'
    
