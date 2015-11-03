# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations


def remove_award_detail(apps, chema_editor):
    apps.get_model('beacons', 'UserAwards').objects.all().delete()


class Migration(migrations.Migration):
    dependencies = [
        ('beacons', '0009_userawards'),
    ]

    operations = [
        migrations.RunPython(remove_award_detail),
        migrations.AlterUniqueTogether(
            name='userawards',
            unique_together=set([('award', 'user')]),
        ),
    ]
