# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('beacons', '0002_campaign'),
    ]

    operations = [
        migrations.RenameField(
            model_name='campaign',
            old_name='date_end',
            new_name='end_date',
        ),
        migrations.RenameField(
            model_name='campaign',
            old_name='date_start',
            new_name='start_date',
        ),
    ]
