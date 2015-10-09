# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        ('beacons', '0004_ad_image'),
    ]

    operations = [
        migrations.CreateModel(
            name='ActionBeacon',
            fields=[
                ('id', models.AutoField(verbose_name='ID', primary_key=True, auto_created=True, serialize=False)),
                ('points', models.IntegerField(default=0)),
            ],
        ),
        migrations.AddField(
            model_name='ad',
            name='type',
            field=models.IntegerField(choices=[(0, 'full_width_image_only'), (1, 'full_width_image_With_content'), (2, 'left_image_With_content')], default=0),
        ),
        migrations.AddField(
            model_name='award',
            name='campaign',
            field=models.ForeignKey(related_name='awards', default=1, to='beacons.Campaign'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='award',
            name='image',
            field=models.ImageField(null=True, upload_to='images/awards', blank=True),
        ),
        migrations.AddField(
            model_name='award',
            name='type',
            field=models.IntegerField(choices=[(0, 'no_image'), (1, 'full_width_image_With_content'), (2, 'left_image_With_content')], default=0),
        ),
        migrations.AddField(
            model_name='promotion',
            name='campaign',
            field=models.ForeignKey(related_name='promotions', default=1, to='beacons.Campaign'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='promotion',
            name='image',
            field=models.ImageField(null=True, upload_to='images/promotions', blank=True),
        ),
        migrations.AddField(
            model_name='shop',
            name='image',
            field=models.ImageField(null=True, upload_to='images/shops', blank=True),
        ),
        migrations.AddField(
            model_name='shop',
            name='latitude',
            field=models.FloatField(null=True, default=50.044328, blank=True),
        ),
        migrations.AddField(
            model_name='shop',
            name='longitude',
            field=models.FloatField(null=True, default=19.952527, blank=True),
        ),
        migrations.AlterField(
            model_name='ad',
            name='campaign',
            field=models.ForeignKey(related_name='ads', to='beacons.Campaign'),
        ),
        migrations.AlterField(
            model_name='ad',
            name='image',
            field=models.ImageField(null=True, upload_to='images/ads', blank=True),
        ),
        migrations.AlterField(
            model_name='shop',
            name='owner',
            field=models.ForeignKey(related_name='shops', choices=[(1, 'Monday'), (2, 'Tuesday'), (3, 'Wednesday'), (4, 'Thursday'), (5, 'Friday'), (6, 'Saturday'), (7, 'Sunday')], to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='actionbeacon',
            name='ad',
            field=models.OneToOneField(related_name='action', blank=True, to='beacons.Ad', null=True),
        ),
        migrations.AddField(
            model_name='actionbeacon',
            name='beacon',
            field=models.OneToOneField(related_name='action', blank=True, to='beacons.Beacon', null=True),
        ),
        migrations.AddField(
            model_name='actionbeacon',
            name='campaign',
            field=models.ForeignKey(related_name='actions', to='beacons.Campaign'),
        ),
    ]
