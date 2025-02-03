from rest_framework import serializers
from department.models import Department

class DepartmentCountSerializer(serializers.ModelSerializer):
    employee_count = serializers.SerializerMethodField()

    def get_employee_count(self, obj):
        return obj.employees.count()

    class Meta:
        model = Department
        fields = ('id', 'name', 'employee_count')