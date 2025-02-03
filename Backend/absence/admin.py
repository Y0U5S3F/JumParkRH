from django.contrib import admin

from .models import Absence, AbsenceType


@admin.register(Absence)
class AbsenceAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'created_at',
        'updated_at',
        'reason',
        'title',
        'start_date',
        'end_date',
        'absence_start_time',
        'absence_end_time',
        'status',
    )
    list_filter = ('created_at', 'updated_at', 'start_date', 'end_date')
    date_hierarchy = 'created_at'
    
@admin.register(AbsenceType)
class AbsenceTypeAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'name', 
        'color',
    )
    list_filter = ('created_at', 'name')
    date_hierarchy = 'created_at'