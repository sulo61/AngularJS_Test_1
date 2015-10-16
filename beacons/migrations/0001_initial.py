# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import beacons.models
import django.contrib.postgres.fields
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='BeaconUser',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('last_login', models.DateTimeField(null=True, verbose_name='last login', blank=True)),
                ('email', models.EmailField(unique=True, max_length=254, db_index=True)),
                ('address', models.CharField(max_length=255)),
                ('is_active', models.BooleanField(default=True)),
                ('is_admin', models.BooleanField(default=False)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='ActionBeacon',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('points', models.IntegerField(default=0)),
            ],
        ),
        migrations.CreateModel(
            name='Ad',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('type', models.IntegerField(default=0, choices=[(1, b'full_width_image_With_content'), (2, b'left_image_With_content'), (0, b'full_width_image_only')])),
                ('title', models.CharField(max_length=100)),
                ('description', models.TextField(blank=True)),
                ('image', models.ImageField(null=True, upload_to=b'images/ads', blank=True)),
            ],
        ),
        migrations.CreateModel(
            name='Award',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('title', models.CharField(max_length=100)),
                ('description', models.TextField(blank=True)),
                ('points', models.IntegerField(blank=True)),
                ('image', models.ImageField(null=True, upload_to=b'images/awards', blank=True)),
                ('type', models.IntegerField(default=0, choices=[(1, b'full_width_image_With_content'), (0, b'no_image'), (2, b'left_image_With_content')])),
            ],
        ),
        migrations.CreateModel(
            name='Beacon',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('title', models.CharField(max_length=100)),
                ('minor', models.IntegerField(default=1, max_length=5)),
                ('major', models.IntegerField(default=1, max_length=5)),
                ('UUID', models.CharField(default=b'00000000-0000-0000-0000-000000000000', max_length=36)),
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
                ('image', models.ImageField(null=True, upload_to=b'images/promotions', blank=True)),
                ('campaign', models.ForeignKey(related_name='promotions', to='beacons.Campaign')),
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
                ('latitude', models.FloatField(default=50.044328, null=True, blank=True)),
                ('longitude', models.FloatField(default=19.952527, null=True, blank=True)),
                ('image', models.ImageField(null=True, upload_to=b'images/shops', blank=True)),
                ('owner', models.ForeignKey(related_name='shops', choices=[(1, b'Monday'), (2, b'Tuesday'), (3, b'Wednesday'), (4, b'Thursday'), (5, b'Friday'), (6, b'Saturday'), (7, b'Sunday')], to=settings.AUTH_USER_MODEL)),
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
            field=models.ForeignKey(related_name='beacons', blank=True, to='beacons.Campaign', null=True),
        ),
        migrations.AddField(
            model_name='award',
            name='campaign',
            field=models.ForeignKey(related_name='awards', to='beacons.Campaign'),
        ),
        migrations.AddField(
            model_name='ad',
            name='campaign',
            field=models.ForeignKey(related_name='ads', to='beacons.Campaign'),
        ),
        migrations.AddField(
            model_name='actionbeacon',
            name='ad',
            field=models.OneToOneField(related_name='action', null=True, blank=True, to='beacons.Ad'),
        ),
        migrations.AddField(
            model_name='actionbeacon',
            name='beacon',
            field=models.OneToOneField(related_name='action', null=True, blank=True, to='beacons.Beacon'),
        ),
        migrations.AddField(
            model_name='actionbeacon',
            name='campaign',
            field=models.ForeignKey(related_name='actions', to='beacons.Campaign'),
        ),
    ]
