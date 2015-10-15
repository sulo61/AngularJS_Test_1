# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('beacons', '0006_auto_20151014_1851'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='beaconscheme',
            name='user',
        ),
        migrations.RemoveField(
            model_name='beacon',
            name='shop',
        ),
        migrations.AddField(
            model_name='beacon',
            name='campaign',
            field=models.ForeignKey(related_name='beacons', blank=True, to='beacons.Campaign', null=True),
        ),
        migrations.DeleteModel(
            name='BeaconScheme',
        ),
    ]
