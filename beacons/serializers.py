from rest_framework import serializers

from beacons.models import Beacon, Campaign, Shop, OpeningHours
from rest_framework.exceptions import ValidationError


class BeaconSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Beacon
        fields = ('id', 'title',)


class CampaignSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Campaign
        fields = ('id', 'name', 'start_date', 'end_date')


class OpeningHoursSerializer(serializers.ModelSerializer):
    class Meta:
        model = OpeningHours
        fields = ('days', 'open_time', 'close_time')


class ShopSerializer(serializers.HyperlinkedModelSerializer):
    opening_hours = OpeningHoursSerializer(many=True)

    class Meta:
        model = Shop
        fields = ('id', 'name', 'opening_hours')

    def create(self, validated_data):
        opening_hours_data = validated_data.pop('opening_hours')
        shop = Shop.objects.create(**validated_data)
        for opening_hours in opening_hours_data:
            OpeningHours.objects.create(shop=shop, **opening_hours)
        return shop

    def is_valid(self, raise_exception=False):
        valid = super(ShopSerializer, self).is_valid(raise_exception)
        opening_hours = self.data.get('opening_hours')
        if valid:
            valid = self.valid_days(opening_hours)

        return valid

    def valid_days(self, opening_hours):
        if not opening_hours:
            return False

        hours_ = opening_hours[0]
        if hours_.get('days')[0] != 1:
            raise ValidationError(detail={'open_hours': ['Days should starts with 0']})

        hours_last = opening_hours[-1]
        if hours_last.get('days')[-1] != 7:
            raise ValidationError(detail={'open_hours': ['Days should ends with 7']})

        day_before = None
        for opening_hour in opening_hours:
            if not opening_hour:
                return False
                # raise ValidationError("opening_hour can not be empty")
            for day in opening_hour.get('days'):
                if day_before is None:
                    day_before = day
                    continue
                if day != day_before + 1:
                    raise ValidationError(detail={'open_hours': ['Days should by ordered constantly form 1 to 7']})

                day_before = day
        return True
