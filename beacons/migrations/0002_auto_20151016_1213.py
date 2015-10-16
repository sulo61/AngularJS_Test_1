# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('beacons', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='beaconuser',
            name='first_name',
            field=models.CharField(max_length=255, null=True, blank=True),
        ),
        migrations.AddField(
            model_name='beaconuser',
            name='last_name',
            field=models.CharField(max_length=255, null=True, blank=True),
        ),
    ]
