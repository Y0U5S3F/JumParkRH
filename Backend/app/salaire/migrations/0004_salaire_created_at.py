# Generated by Django 5.1.5 on 2025-03-10 13:28

import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('salaire', '0003_salaire_jour_abcense'),
    ]

    operations = [
        migrations.AddField(
            model_name='salaire',
            name='created_at',
            field=models.DateTimeField(auto_now_add=True, default=django.utils.timezone.now, verbose_name='Date de création'),
            preserve_default=False,
        ),
    ]
