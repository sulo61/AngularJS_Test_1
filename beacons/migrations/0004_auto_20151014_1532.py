# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('beacons', '0003_auto_20151014_1113'),
    ]

    operations = [
        migrations.AddField(
            model_name='beacon',
            name='UUID',
            field=models.CharField(default=b'f7826da6-4fa2-4e98-8024-bc5b71e0893e', max_length=36),
        ),
        migrations.AddField(
            model_name='beacon',
            name='major',
            field=models.IntegerField(default=1, max_length=5),
        ),
        migrations.AddField(
            model_name='beacon',
            name='minor',
            field=models.IntegerField(default=1, max_length=5),
        ),
    ]
