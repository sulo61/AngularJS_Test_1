# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('beacons', '0002_auto_20151009_1657'),
    ]

    operations = [
        migrations.AlterField(
            model_name='ad',
            name='type',
            field=models.IntegerField(default=0, choices=[(1, b'full_width_image_With_content'), (2, b'left_image_With_content'), (0, b'full_width_image_only')]),
        ),
        migrations.AlterField(
            model_name='award',
            name='type',
            field=models.IntegerField(default=0, choices=[(1, b'full_width_image_With_content'), (0, b'no_image'), (2, b'left_image_With_content')]),
        ),
    ]
