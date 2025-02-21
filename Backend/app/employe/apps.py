from django.apps import AppConfig

class EmployeConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'employe'
    
    def ready(self):
        import employe.signals
