from django.db import models


# Create your models here.

class Beacon(models.Model):
    title = models.CharField(max_length=100, blank=False)


class Campaign(models.Model):
    pass
