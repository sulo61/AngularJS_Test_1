# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('beacons', '0009_userawards'),
    ]

    operations = [
        migrations.AlterUniqueTogether(
            name='userawards',
            unique_together=set([('award', 'user')]),
        ),
    ]
