# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('beacons', '0007_auto_20151028_1342'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='userawards',
            name='award',
        ),
        migrations.RemoveField(
            model_name='userawards',
            name='user',
        ),
        migrations.DeleteModel(
            name='UserAwards',
        ),
    ]
