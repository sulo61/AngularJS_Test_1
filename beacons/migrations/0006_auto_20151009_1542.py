# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('beacons', '0005_auto_20151009_1031'),
    ]

    operations = [
        migrations.AlterField(
            model_name='ad',
            name='type',
            field=models.IntegerField(choices=[(2, 'left_image_With_content'), (0, 'full_width_image_only'), (1, 'full_width_image_With_content')], default=0),
        ),
        migrations.AlterField(
            model_name='award',
            name='type',
            field=models.IntegerField(choices=[(2, 'left_image_With_content'), (1, 'full_width_image_With_content'), (0, 'no_image')], default=0),
        ),
    ]
