# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        ('beacons', '0012_auto_20151104_1401'),
    ]

    operations = [
        migrations.AddField(
            model_name='beacon',
            name='shop',
            field=models.ForeignKey(related_name='beacons', blank=True, to='beacons.Shop', null=True),
        ),
        migrations.AddField(
            model_name='beacon',
            name='user',
            field=models.ForeignKey(related_name='beacons', blank=True, to=settings.AUTH_USER_MODEL, null=True),
        ),
    ]
