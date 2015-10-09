from beacons.models import Campaign, Shop
from django.contrib import admin


# Register your models here.
@admin.register(Campaign, Shop)
class Campaign(admin.ModelAdmin):
    pass
