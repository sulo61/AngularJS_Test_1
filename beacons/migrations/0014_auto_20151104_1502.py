# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('beacons', '0013_auto_20151104_1420'),
    ]

    operations = [
        migrations.AlterField(
            model_name='actionbeacon',
            name='ad',
            field=models.ForeignKey(related_name='actions', blank=True, to='beacons.Ad', null=True),
        ),
        migrations.AlterField(
            model_name='actionbeacon',
            name='beacon',
            field=models.ForeignKey(related_name='actions', blank=True, to='beacons.Beacon', null=True),
        ),
        migrations.AlterField(
            model_name='actionbeacon',
            name='campaign',
            field=models.ForeignKey(related_name='actions', blank=True, to='beacons.Campaign', null=True),
        ),
        migrations.AlterUniqueTogether(
            name='actionbeacon',
            unique_together=set([('beacon', 'ad', 'campaign')]),
        ),
    ]
