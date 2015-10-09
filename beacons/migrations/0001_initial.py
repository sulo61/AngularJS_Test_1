# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from django.conf import settings
import django.contrib.postgres.fields
import beacons.models


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='ActionBeacon',
            fields=[
                ('id', models.AutoField(serialize=False, auto_created=True, verbose_name='ID', primary_key=True)),
                ('points', models.IntegerField(default=0)),
            ],
        ),
        migrations.CreateModel(
            name='Ad',
            fields=[
                ('id', models.AutoField(serialize=False, auto_created=True, verbose_name='ID', primary_key=True)),
                ('type', models.IntegerField(choices=[(2, 'left_image_With_content'), (1, 'full_width_image_With_content'), (0, 'full_width_image_only')], default=0)),
                ('title', models.CharField(max_length=100)),
                ('description', models.TextField(blank=True)),
                ('image', models.ImageField(null=True, upload_to='images/ads', blank=True)),
            ],
        ),
        migrations.CreateModel(
            name='Award',
            fields=[
                ('id', models.AutoField(serialize=False, auto_created=True, verbose_name='ID', primary_key=True)),
                ('title', models.CharField(max_length=100)),
                ('description', models.TextField(blank=True)),
                ('points', models.IntegerField(blank=True)),
                ('image', models.ImageField(null=True, upload_to='images/awards', blank=True)),
                ('type', models.IntegerField(choices=[(0, 'no_image'), (2, 'left_image_With_content'), (1, 'full_width_image_With_content')], default=0)),
            ],
        ),
        migrations.CreateModel(
            name='Beacon',
            fields=[
                ('id', models.AutoField(serialize=False, auto_created=True, verbose_name='ID', primary_key=True)),
                ('title', models.CharField(max_length=100)),
            ],
        ),
        migrations.CreateModel(
            name='Campaign',
            fields=[
                ('id', models.AutoField(serialize=False, auto_created=True, verbose_name='ID', primary_key=True)),
                ('name', models.CharField(max_length=100)),
                ('start_date', models.DateTimeField()),
                ('end_date', models.DateTimeField()),
                ('owner', models.ForeignKey(to=settings.AUTH_USER_MODEL, related_name='campaigns')),
            ],
            bases=(models.Model, beacons.models.TimestampMixin),
        ),
        migrations.CreateModel(
            name='OpeningHours',
            fields=[
                ('id', models.AutoField(serialize=False, auto_created=True, verbose_name='ID', primary_key=True)),
                ('days', django.contrib.postgres.fields.ArrayField(base_field=models.IntegerField(), size=7)),
                ('open_time', models.TimeField(blank=True)),
                ('close_time', models.TimeField(blank=True)),
            ],
        ),
        migrations.CreateModel(
            name='Promotion',
            fields=[
                ('id', models.AutoField(serialize=False, auto_created=True, verbose_name='ID', primary_key=True)),
                ('title', models.CharField(max_length=100)),
                ('points', models.IntegerField(blank=True)),
                ('description', models.TextField(blank=True)),
                ('image', models.ImageField(null=True, upload_to='images/promotions', blank=True)),
                ('campaign', models.ForeignKey(to='beacons.Campaign', related_name='promotions')),
            ],
        ),
        migrations.CreateModel(
            name='Scenario',
            fields=[
                ('id', models.AutoField(serialize=False, auto_created=True, verbose_name='ID', primary_key=True)),
            ],
        ),
        migrations.CreateModel(
            name='Shop',
            fields=[
                ('id', models.AutoField(serialize=False, auto_created=True, verbose_name='ID', primary_key=True)),
                ('name', models.CharField(max_length=100)),
                ('address', models.CharField(max_length=200)),
                ('latitude', models.FloatField(null=True, blank=True, default=50.044328)),
                ('longitude', models.FloatField(null=True, blank=True, default=19.952527)),
                ('image', models.ImageField(null=True, upload_to='images/shops', blank=True)),
                ('owner', models.ForeignKey(choices=[(1, 'Monday'), (2, 'Tuesday'), (3, 'Wednesday'), (4, 'Thursday'), (5, 'Friday'), (6, 'Saturday'), (7, 'Sunday')], to=settings.AUTH_USER_MODEL, related_name='shops')),
            ],
        ),
        migrations.AddField(
            model_name='openinghours',
            name='shop',
            field=models.ForeignKey(to='beacons.Shop', related_name='opening_hours'),
        ),
        migrations.AddField(
            model_name='beacon',
            name='campaign',
            field=models.ForeignKey(null=True, blank=True, related_name='beacons', to='beacons.Campaign'),
        ),
        migrations.AddField(
            model_name='beacon',
            name='user',
            field=models.ForeignKey(to=settings.AUTH_USER_MODEL, related_name='beacons'),
        ),
        migrations.AddField(
            model_name='award',
            name='campaign',
            field=models.ForeignKey(to='beacons.Campaign', related_name='awards'),
        ),
        migrations.AddField(
            model_name='ad',
            name='campaign',
            field=models.ForeignKey(to='beacons.Campaign', related_name='ads'),
        ),
        migrations.AddField(
            model_name='actionbeacon',
            name='ad',
            field=models.OneToOneField(null=True, blank=True, related_name='action', to='beacons.Ad'),
        ),
        migrations.AddField(
            model_name='actionbeacon',
            name='beacon',
            field=models.OneToOneField(null=True, blank=True, related_name='action', to='beacons.Beacon'),
        ),
        migrations.AddField(
            model_name='actionbeacon',
            name='campaign',
            field=models.ForeignKey(to='beacons.Campaign', related_name='actions'),
        ),
    ]
