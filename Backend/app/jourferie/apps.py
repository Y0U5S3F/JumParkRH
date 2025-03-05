from django.apps import AppConfig


class JourferieConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'jourferie'

    def ready(self):
        import jourferie.signals
