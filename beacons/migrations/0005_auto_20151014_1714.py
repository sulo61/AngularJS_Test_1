# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('beacons', '0004_auto_20151014_1532'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='beacon',
            name='campaign',
        ),
        migrations.AddField(
            model_name='beacon',
            name='shop',
            field=models.ForeignKey(related_name='beacons', blank=True, to='beacons.Shop', null=True),
        ),
        migrations.AlterField(
            model_name='beacon',
            name='UUID',
            field=models.CharField(default=b'00000000-0000-0000-0000-000000000000', max_length=36),
        ),
    ]
