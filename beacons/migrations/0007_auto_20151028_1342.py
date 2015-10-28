# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        ('beacons', '0006_auto_20151027_1310'),
    ]

    operations = [
        migrations.CreateModel(
            name='UserAwards',
            fields=[
                ('award', models.OneToOneField(primary_key=True, serialize=False, to='beacons.Award')),
                ('favorite', models.BooleanField(default=False)),
                ('bought', models.BooleanField(default=False)),
                ('user', models.ForeignKey(related_name='user_awards', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.AlterField(
            model_name='beacon',
            name='major',
            field=models.IntegerField(default=1),
        ),
        migrations.AlterField(
            model_name='beacon',
            name='minor',
            field=models.IntegerField(default=1),
        ),
    ]
