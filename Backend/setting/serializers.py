from rest_framework import serializers
from .models import ConfigurationDays, OverlapPeriod, Schedule, WeeklySchedule, DaySchedule
from department.serializers import DepartmentSerializer



        
class ConfigurationDaysSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = ConfigurationDays
        fields = ('id','weekday','start_at','end_at','break_duration','duration', 'overlap_period')
       

class OverlapPeriodSerializer(serializers.ModelSerializer):
    department = DepartmentSerializer(many=True)
    days = serializers.SerializerMethodField()
    class Meta:
        model = OverlapPeriod
        fields = ('id','user','department','days','schedule_type','start_date','end_date','default')
    def get_days(self, obj):
            configuration_days = obj.configurationdays_set.all()
            serializer = ConfigurationDaysSerializer(configuration_days, many=True)
            return serializer.data

class ScheduleSerializer(serializers.ModelSerializer):
    periods = OverlapPeriodSerializer(many=True)
    class Meta:
        model = Schedule
        fields = ('id','name','periods')
       
       
        



class DayScheduleSerializer(serializers.ModelSerializer):
    day = serializers.CharField(source='day.name', read_only=True)

    class Meta:
        model = DaySchedule
        fields = ('id','week_schedule','check_in','check_out','break_duration','duration', 'day')
class DayScheduleCreateSerializer(serializers.ModelSerializer):

    class Meta:
        model = DaySchedule
        fields = ('id','week_schedule','check_in','check_out','break_duration','duration', 'day')

class WeeklyScheduleSerializer(serializers.ModelSerializer):
    dayschedule_set = DayScheduleSerializer(many=True)

    class Meta:
        model = WeeklySchedule
        fields = '__all__'



class DayScheduleUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = DaySchedule
        fields = ('day', 'check_in', 'check_out')

class WeeklyScheduleUpdateSerializer(serializers.ModelSerializer):
    dayschedule_set = DayScheduleUpdateSerializer(many=True)

    class Meta:
        model = WeeklySchedule
        fields = ('employee', 'week_name', 'start_date_of_week', 'end_date_of_week', 'dayschedule_set')

    def update(self, instance, validated_data):
        dayschedule_data = validated_data.pop('dayschedule_set')
        instance.employee = validated_data.get('employee', instance.employee)
        instance.week_name = validated_data.get('week_name', instance.week_name)
        instance.start_date_of_week = validated_data.get('start_date_of_week', instance.start_date_of_week)
        instance.end_date_of_week = validated_data.get('end_date_of_week', instance.end_date_of_week)
        instance.save()

        # Maintenant, mettez à jour ou créez les instances de DaySchedule
        updated_day_ids = []  # Pour suivre les jours déjà mis à jour
        for dayschedule_item in dayschedule_data:
            day = dayschedule_item.get('day')
            check_in = dayschedule_item.get('check_in')
            check_out = dayschedule_item.get('check_out')

            dayschedule, created = DaySchedule.objects.get_or_create(week_schedule=instance, day=day)
            dayschedule.check_in = check_in
            dayschedule.check_out = check_out
            dayschedule.save()
            updated_day_ids.append(dayschedule.id)

        # Supprimez les jours qui n'ont pas été mis à jour
        for dayschedule in instance.dayschedule_set.all():
            if dayschedule.id not in updated_day_ids:
                dayschedule.delete()

        return instance
    
    
class WeeklyScheduleCreateSerializer(serializers.ModelSerializer):
    dayschedule_set = DayScheduleCreateSerializer(many=True)  # Utilisez le sérialiseur pour les DaySchedule

    class Meta:
        model = WeeklySchedule
        fields = '__all__'

    def create(self, validated_data):
        day_schedule_data = validated_data.pop('dayschedule_set', [])  # Récupérez les données DaySchedule

        # Créez d'abord le WeeklySchedule
        weekly_schedule = WeeklySchedule.objects.create(**validated_data)

        # Ensuite, créez les DaySchedule associés
        for day_schedule in day_schedule_data:
            DaySchedule.objects.create(week_schedule=weekly_schedule, **day_schedule)

        return weekly_schedule

    def update(self, instance, validated_data):
        dayschedule_data = validated_data.pop('dayschedule_set')
        dayschedule_set = instance.dayschedule_set.all()
        dayschedule_data = (dict(item) for item in dayschedule_data)
        for day_schedule, day_data in zip(dayschedule_set, dayschedule_data):
            day_schedule.day = day_data.get('day', day_schedule.day)
            day_schedule.check_in = day_data.get('check_in', day_schedule.check_in)
            day_schedule.check_out = day_data.get('check_out', day_schedule.check_out)
            day_schedule.save()
        return instance