# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('beacons', '0003_auto_20151020_1439'),
    ]

    operations = [
        migrations.AlterField(
            model_name='openinghours',
            name='close_time',
            field=models.TimeField(null=True, blank=True),
        ),
        migrations.AlterField(
            model_name='openinghours',
            name='open_time',
            field=models.TimeField(null=True, blank=True),
        ),
    ]
