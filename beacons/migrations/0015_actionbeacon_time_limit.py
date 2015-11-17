# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('beacons', '0014_auto_20151104_1502'),
    ]

    operations = [
        migrations.AddField(
            model_name='actionbeacon',
            name='time_limit',
            field=models.BigIntegerField(default=0),
        ),
    ]
