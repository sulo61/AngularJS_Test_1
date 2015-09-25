# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('beacons', '0003_auto_20150925_1609'),
    ]

    operations = [
        migrations.AddField(
            model_name='beacon',
            name='campaign',
            field=models.ForeignKey(related_name='beacons', to='beacons.Campaign', null=True),
        ),
    ]
