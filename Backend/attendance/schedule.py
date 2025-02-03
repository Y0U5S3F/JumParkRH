import schedule
import time
from .views import get_attendance

def schedule_task():
    schedule.every(1).minutes.do(get_attendance)

    while True:
        schedule.run_pending()
        time.sleep(1)

schedule_task()
