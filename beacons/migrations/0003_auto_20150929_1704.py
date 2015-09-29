# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('beacons', '0002_auto_20150929_1420'),
    ]

    operations = [
        migrations.AlterField(
            model_name='beacon',
            name='campaign',
            field=models.ForeignKey(related_name='beacons', blank=True, to='beacons.Campaign', null=True),
        ),
    ]
