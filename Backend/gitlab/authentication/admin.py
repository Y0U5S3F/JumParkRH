from django.contrib import admin
from import_export.admin import ImportExportModelAdmin

from .models import UserAccount, HR, Employee
from rest_framework.authtoken.models import TokenProxy
from rest_framework_simplejwt import token_blacklist

#delete user
class OutstandingTokenAdmin(token_blacklist.admin.OutstandingTokenAdmin):
    
    def has_delete_permission(self, *args, **kwargs):
        return True # or whatever logic you want

admin.site.unregister(token_blacklist.models.OutstandingToken)
admin.site.register(token_blacklist.models.OutstandingToken, OutstandingTokenAdmin)
admin.site.unregister(TokenProxy)




@admin.register(UserAccount)
class UserAccountAdmin(ImportExportModelAdmin,admin.ModelAdmin):
    list_display = (
        'id',
        'department',
        'matricule',
        'full_name',
        'first_name',
        'password',
        'last_login',
        'role',
        'email',
        'fonction',
        'is_active',
        'is_admin',
        'is_staff',
        'is_superuser',
        'is_hr',
        'is_employee',
    )
    list_filter = (
        'last_login',
        'is_active',
        'is_admin',
        'is_staff',
        'is_superuser',
        'is_hr',
        'is_employee',
        'department',
    )


@admin.register(HR)
class HRAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'password',
        'last_login',
        'role',
        'email',
        'is_active',
        'is_admin',
        'is_staff',
        'is_superuser',
        'is_hr',
        'is_employee',
    )
    list_filter = (
        'last_login',
        'is_active',
        'is_admin',
        'is_staff',
        'is_superuser',
        'is_hr',
        'is_employee',
    )


@admin.register(Employee)
class EmployeeAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'password',
        'last_login',
        'role',
        'email',
        'is_active',
        'is_admin',
        'is_staff',
        'is_superuser',
        'is_hr',
        'is_employee',

    )
    list_filter = (
        'last_login',
        'is_active',
        'is_admin',
        'is_staff',
        'is_superuser',
        'is_hr',
        'is_employee',
        'department',

    )