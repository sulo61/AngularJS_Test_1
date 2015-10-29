from beacons.models import Campaign, Shop, BeaconUser
from django.contrib import admin


# Register your models here.
@admin.register(Campaign, Shop)
class Campaign(admin.ModelAdmin):
    pass


@admin.register(BeaconUser)
class User(admin.ModelAdmin):
    pass
