# run the app

> python manage.py runserver

# start a new app

> python manage.py startapp attendance

# migrate changes to the database

> python manage.py migrate

# python manage.py makemigrations attendance

> create a new migration

# create a super user

> python manage.py createsuperuser

pip freeze > requirements.txt
pip install -r requirements.txt

# run the app using docker

docker compose -f docker-compose.yml up -d

# Development Environment

URL : https://pointage.aftercode.tn
email: admin@gmail.com
password: admin
username: admin

python manage.py admin_generator service
python manage.py admin_generator department
python manage.py admin_generator holiday
python manage.py admin_generator authentication

<!-- pour creation des valeus par defaut dans la BD -->

# create_default_configuration_days , create_default_overlap_period_type, create_default_overlap_period

> python manage.py shell

from setting.signals import create_default_configuration_days, create_default_overlap_period_type, create_default_overlap_period, create_default_day

from setting.signals import create_default_day

create_default_day(None)

create_default_overlap_period_type(None)
create_default_overlap_period(None)
create_default_configuration_days(None)

<!-- cron job -->

python manage.py crontab show
python manage.py crontab remove
python manage.py crontab add

<!-- celery -->

celery -A celery_config:app worker --loglevel=info
