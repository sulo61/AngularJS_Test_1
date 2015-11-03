# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('beacons', '0010_auto_20151030_1118'),
    ]

    operations = [
        migrations.AddField(
            model_name='campaign',
            name='is_active',
            field=models.BooleanField(default=False),
        ),
    ]
