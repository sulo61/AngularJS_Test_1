# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from django.conf import settings
import beacons.models


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('beacons', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Campaign',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=100)),
                ('date_start', models.DateTimeField()),
                ('date_end', models.DateTimeField()),
                ('owner', models.ForeignKey(related_name='campaigns', to=settings.AUTH_USER_MODEL)),
            ],
            bases=(models.Model, beacons.models.TimestampMixin),
        ),
    ]
