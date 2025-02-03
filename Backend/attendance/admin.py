from django.contrib import admin
from .models import Attendance,Delay
from import_export.admin import ImportExportModelAdmin
# from import_export import fields, resources


@admin.register(Attendance)
class AttendanceAdmin(ImportExportModelAdmin,admin.ModelAdmin):
    list_display = (
        'id',
        'date',
        'user',
        'get_status',
        'status',
        'checkin',
        'checkout',
        'duration',
        'additional_hours',
    )
    list_filter = ('created_at', 'updated_at', 'date','status')
    date_hierarchy = 'created_at'
    
    # def get_mat(self, obj):
    #     return obj.user.matricule
    # get_mat.short_description = "matricule"
    
    # def get_service(self, obj):
    #     return obj.user.fonction
    # get_name.short_description = "Fonction"
    
@admin.register(Delay)
class DelayAdmin(ImportExportModelAdmin,admin.ModelAdmin):
    list_display = (
        'id',
        'employee',
        'duration',
    )
    list_filter = ('created_at', 'updated_at')
    date_hierarchy = 'created_at'
    
