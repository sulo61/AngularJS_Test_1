from beacons.models import Campaign
from django.contrib import admin


# Register your models here.
@admin.register(Campaign)
class Campaign(admin.ModelAdmin):
    pass
