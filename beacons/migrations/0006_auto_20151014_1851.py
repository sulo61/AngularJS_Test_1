# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('beacons', '0005_auto_20151014_1714'),
    ]

    operations = [
        migrations.CreateModel(
            name='BeaconScheme',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('title', models.CharField(max_length=100)),
                ('minor', models.IntegerField(default=1, max_length=5)),
                ('major', models.IntegerField(default=1, max_length=5)),
                ('user', models.ForeignKey(related_name='beacons', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.RemoveField(
            model_name='beacon',
            name='user',
        ),
    ]
