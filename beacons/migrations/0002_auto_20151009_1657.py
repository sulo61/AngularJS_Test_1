# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('beacons', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='ad',
            name='image',
            field=models.ImageField(null=True, upload_to='static/images/ads', blank=True),
        ),
        migrations.AlterField(
            model_name='award',
            name='image',
            field=models.ImageField(null=True, upload_to='static/images/awards', blank=True),
        ),
        migrations.AlterField(
            model_name='award',
            name='type',
            field=models.IntegerField(choices=[(2, 'left_image_With_content'), (1, 'full_width_image_With_content'), (0, 'no_image')], default=0),
        ),
        migrations.AlterField(
            model_name='promotion',
            name='image',
            field=models.ImageField(null=True, upload_to='static/images/promotions', blank=True),
        ),
        migrations.AlterField(
            model_name='shop',
            name='image',
            field=models.ImageField(null=True, upload_to='static/images/shops', blank=True),
        ),
    ]
