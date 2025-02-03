from django.db.models.signals import post_migrate
from django.dispatch import receiver

from .models import ConfigurationDays, OverlapPeriodType, OverlapPeriod, Day

@receiver(post_migrate)
def create_default_configuration_days(sender, **kwargs):
    for config_data in ConfigurationDays.DEFAULT_CONFIGURATION_DAYS:
        overlap_period_type_name = config_data.get('overlap_period')  # Extrayez le nom du type de chevauchement
        
        if overlap_period_type_name:
            # Obtenez l'objet OverlapPeriodType correspondant au nom
            overlap_period_type, created = OverlapPeriodType.objects.get_or_create(name=overlap_period_type_name)
            
            # Obtenez ou créez l'objet OverlapPeriod correspondant à overlap_period_type
            overlap_period, created = OverlapPeriod.objects.get_or_create(schedule_type=overlap_period_type)
            
            # Remplacez la valeur de 'overlap_period' par l'objet créé
            config_data['overlap_period'] = overlap_period
        
        # Vérifiez si une instance avec les mêmes données existe déjà
        if not ConfigurationDays.objects.filter(**config_data).exists():
            ConfigurationDays.objects.create(**config_data)

@receiver(post_migrate)
def create_default_overlap_period_type(sender, **kwargs):
    for config_data in OverlapPeriodType.DEFAULT_OVERLAP_PERIOD:
        # Vérifiez si une instance avec le même nom existe déjà
        if not OverlapPeriodType.objects.filter(name=config_data['name']).exists():
            OverlapPeriodType.objects.create(**config_data)

@receiver(post_migrate)
def create_default_overlap_period(sender, **kwargs):
    for config_data in OverlapPeriod.DEFAULT_OVERLAP_PERIOD:
        # Vérifiez si une instance avec le même type de période existe déjà
        if not OverlapPeriod.objects.filter(schedule_type__name=config_data['schedule_type']).exists():
            OverlapPeriod.objects.create(schedule_type=OverlapPeriodType.objects.get(name=config_data['schedule_type']))
            
            
@receiver(post_migrate)
def create_default_day(sender, **kwargs):
    if sender.name == "setting": 
        for day_data in Day.DEFAULT_DAY:
            day_name = day_data['name']
            if not Day.objects.filter(name=day_name).exists():
                Day.objects.create(name=day_name)