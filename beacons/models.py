from django.db import models


# Create your models here.

class TimestampMixin(object):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class Beacon(models.Model):
    title = models.CharField(max_length=100, blank=False)
    campaign = models.ForeignKey('Campaign', related_name='beacons', null=True)

    def __str__(self):
        return self.title


class Campaign(models.Model, TimestampMixin):
    name = models.CharField(max_length=100, blank=False)
    owner = models.ForeignKey('auth.User', related_name='campaigns')
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()

    def __str__(self):
        return self.name
