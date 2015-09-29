# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import beacons.models
import django.contrib.postgres.fields
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Ad',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('title', models.CharField(max_length=100)),
                ('description', models.TextField(blank=True)),
            ],
        ),
        migrations.CreateModel(
            name='Award',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('title', models.CharField(max_length=100)),
                ('description', models.TextField(blank=True)),
                ('points', models.IntegerField(blank=True)),
            ],
        ),
        migrations.CreateModel(
            name='Beacon',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('title', models.CharField(max_length=100)),
            ],
        ),
        migrations.CreateModel(
            name='Campaign',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=100)),
                ('start_date', models.DateTimeField()),
                ('end_date', models.DateTimeField()),
                ('owner', models.ForeignKey(related_name='campaigns', to=settings.AUTH_USER_MODEL)),
            ],
            bases=(models.Model, beacons.models.TimestampMixin),
        ),
        migrations.CreateModel(
            name='OpeningHours',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('days', django.contrib.postgres.fields.ArrayField(base_field=models.IntegerField(), size=7)),
                ('open_time', models.TimeField(blank=True)),
                ('close_time', models.TimeField(blank=True)),
            ],
        ),
        migrations.CreateModel(
            name='Promotion',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('title', models.CharField(max_length=100)),
                ('points', models.IntegerField(blank=True)),
                ('description', models.TextField(blank=True)),
            ],
        ),
        migrations.CreateModel(
            name='Scenario',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
            ],
        ),
        migrations.CreateModel(
            name='Shop',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=100)),
                ('address', models.CharField(max_length=200)),
                ('owner', models.ForeignKey(related_name='shops', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.AddField(
            model_name='openinghours',
            name='shop',
            field=models.ForeignKey(related_name='opening_hours', to='beacons.Shop'),
        ),
        migrations.AddField(
            model_name='beacon',
            name='campaign',
            field=models.ForeignKey(related_name='beacons', to='beacons.Campaign'),
        ),
        migrations.AddField(
            model_name='beacon',
            name='user',
            field=models.ForeignKey(related_name='beacons', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='ad',
            name='campaign',
            field=models.ForeignKey(related_name='adds', to='beacons.Campaign'),
        ),
    ]
