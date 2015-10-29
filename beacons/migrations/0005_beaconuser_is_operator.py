# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('beacons', '0004_auto_20151022_1524'),
    ]

    operations = [
        migrations.AddField(
            model_name='beaconuser',
            name='is_operator',
            field=models.BooleanField(default=False),
        ),
    ]
