# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('beacons', '0002_auto_20151016_1213'),
    ]

    operations = [
        migrations.AlterField(
            model_name='beaconuser',
            name='address',
            field=models.CharField(max_length=255, null=True, blank=True),
        ),
    ]
