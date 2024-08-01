# Generated by Django 5.0.1 on 2024-07-31 05:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('myapp', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='CustomUser',
            fields=[
                ('user_id', models.CharField(max_length=8, primary_key=True, serialize=False)),
                ('user_email', models.EmailField(max_length=254, unique=True)),
                ('user_first_name', models.CharField(max_length=30)),
                ('user_middle_name', models.CharField(blank=True, max_length=30)),
                ('user_last_name', models.CharField(max_length=30)),
                ('user_dob', models.DateField()),
                ('user_phone_number', models.BigIntegerField()),
                ('user_country', models.CharField(max_length=50)),
                ('user_city', models.CharField(max_length=50)),
                ('user_profile_photo', models.ImageField(blank=True, null=True, upload_to='profile_photos/')),
                ('user_password', models.CharField(max_length=255)),
                ('user_type', models.CharField(max_length=50)),
                ('user_joined_date', models.DateTimeField(auto_now_add=True)),
            ],
            options={
                'db_table': 'users',
            },
        ),
    ]