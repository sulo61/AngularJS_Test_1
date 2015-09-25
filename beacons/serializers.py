from rest_framework import serializers

from beacons.models import Beacon, Campaign


class BeaconSerializer(serializers.ModelSerializer):
    class Meta:
        model = Beacon
        fields = ('title',)


class CampaignSerializer(serializers.ModelSerializer):
    class Meta:
        model = Campaign
        fields = ('id', 'name', 'start_date', 'end_date')