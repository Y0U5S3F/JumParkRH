# Generated by Django 5.1.5 on 2025-02-08 12:17

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('employe', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='employe',
            name='matricule',
            field=models.CharField(max_length=6, primary_key=True, serialize=False, verbose_name='Matricule'),
        ),
    ]
