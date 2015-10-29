# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        ('beacons', '0008_auto_20151029_1356'),
    ]

    operations = [
        migrations.CreateModel(
            name='UserAwards',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('favorite', models.BooleanField(default=False)),
                ('bought', models.BooleanField(default=False)),
                ('award', models.ForeignKey(related_name='details', to='beacons.Award')),
                ('user', models.ForeignKey(related_name='user_awards', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
