from django.contrib import admin

from .models import TypeWork, WorkTime, OverlapPeriod, ConfigurationDays, Schedule, OverlapPeriodType, Day,WeeklySchedule, DaySchedule


@admin.register(TypeWork)
class TypeWorkAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'created_at',
        'updated_at',
        'name',
        'type',
        'start_time_work',
        'start_time_break',
        'end_time_break',
        'end_time_work',
    )
    list_filter = ('created_at', 'updated_at')
    search_fields = ('name',)
    date_hierarchy = 'created_at'


@admin.register(WorkTime)
class WorkTimeAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'created_at',
        'updated_at',
        'period',
        'start_date',
        'end_date',
        'number_hours',
        'type',
        'user',
    )
    list_filter = (
        'created_at',
        'updated_at',
        'start_date',
        'end_date',
        'type',
        'user',
    )
    date_hierarchy = 'created_at'


@admin.register(OverlapPeriod)
class OverlapPeriodAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'created_at',
        'updated_at',
        'schedule_type',
        'start_date',
        'end_date',
        'default',
        'user'
    )
    list_filter = (
        'created_at',
        'updated_at',
        'start_date',
        'end_date',
        'default',
    )
    date_hierarchy = 'created_at'

@admin.register(OverlapPeriodType)
class OverlapPeriodTypeAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'name',

    )



@admin.register(ConfigurationDays)
class ConfigurationDaysAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'created_at',
        'updated_at',
        'weekday',
        'start_at',
        'end_at',
        # 'get_duration',
        'overlap_period',
    )
    list_filter = ('created_at', 'updated_at', 'overlap_period')
    date_hierarchy = 'created_at'


@admin.register(Schedule)
class ScheduleAdmin(admin.ModelAdmin):
    list_display = ('id', 'created_at', 'updated_at', 'name')
    list_filter = ('created_at', 'updated_at')
    raw_id_fields = ('periods',)
    search_fields = ('name',)
    date_hierarchy = 'created_at'


class WeeklyScheduleAdmin(admin.ModelAdmin):
    list_display = ('employee', 'week_name', 'start_date_of_week', 'end_date_of_week')

class DayScheduleAdmin(admin.ModelAdmin):
    list_display = ('id','check_in', 'check_out','week_schedule','day','get_employee')
    
    def get_employee(self, obj):
         return obj.week_schedule.employee
    get_employee.short_description = "employee"
class DayAdmin(admin.ModelAdmin):
    list_display = ('name',)

admin.site.register(WeeklySchedule, WeeklyScheduleAdmin)
admin.site.register(DaySchedule, DayScheduleAdmin)
admin.site.register(Day, DayAdmin)