from django.contrib import admin

from .models import Device


@admin.register(Device)
class DeviceAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'created_at',
        'updated_at',
        'name',
        'ip',
        'port',
        'model',
        'is_admin',
    )
    list_filter = ('created_at', 'updated_at', 'is_admin')
    search_fields = ('name',)
    date_hierarchy = 'created_at'
