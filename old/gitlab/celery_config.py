from celery import Celery

app = Celery('attendance', broker='redis://localhost:6379/0')

# Optional configuration settings
app.conf.result_backend = 'redis://localhost:6379/1'
app.conf.task_serializer = 'json'
app.conf.result_serializer = 'json'