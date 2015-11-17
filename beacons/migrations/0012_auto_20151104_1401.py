# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import beacons.models
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        ('beacons', '0011_campaign_is_active'),
    ]

    operations = [
        migrations.CreateModel(
            name='UserCampaign',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('user_points', models.IntegerField(default=0)),
                ('campaign', models.ForeignKey(related_name='user_details', to='beacons.Campaign')),
            ],
            bases=(models.Model, beacons.models.TimestampMixin),
        ),
        migrations.AddField(
            model_name='beaconuser',
            name='image',
            field=models.ImageField(null=True, upload_to=b'images/user', blank=True),
        ),
        migrations.AddField(
            model_name='usercampaign',
            name='user',
            field=models.ForeignKey(related_name='user_campaign', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterUniqueTogether(
            name='usercampaign',
            unique_together=set([('campaign', 'user')]),
        ),
    ]
