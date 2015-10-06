import time
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
from rest_framework import serializers

from beacons.models import Beacon, Campaign, Shop, OpeningHours, Ad, ActionBeacon
from rest_framework.exceptions import ValidationError
from rest_framework.serializers import ModelSerializer


class UserSerializer(serializers.ModelSerializer):
    def create(self, validated_data):
        user = User.objects.create(
            username=validated_data['username']
        )
        user.set_password(validated_data['password'])
        user.save()

        return user

    class Meta:
        model = User
        fields = ("id", 'username', 'password', 'email', 'first_name', 'last_name')
        extra_kwargs = {
            'password': {'write_only': True},
            'username': {'write_only': True}
        }
        read_only_fields = ('id',)


class UserProfileView(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('email', 'first_name', 'last_name')
        read_only_fields = ('id',)


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
                raise ValidationError(detail={'open_hours': ['This field is required']})

            if time.strptime(opening_hour.get('open_time'), "%H:%M:%S") >= \
                    time.strptime(opening_hour.get('close_time'), "%H:%M:%S"):
                raise ValidationError(detail={'open_hours': ['open_time should be before close_time']})

            for day in opening_hour.get('days'):
                if day_before is None:
                    day_before = day
                    continue
                if day != day_before + 1:
                    raise ValidationError(detail={'open_hours': ['Days should by ordered constantly form 1 to 7']})

                day_before = day
        return True


class AdSerializerCreate(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField(method_name='get_image_url_json')

    def get_image_url_json(self, obj):
        try:
            uri = 'http://%s/%s' % (self.context['request'].get_host(), obj.image.url)
            print self.context['request'].get_host()
            return uri
        except ValueError:
            return None

    class Meta:
        model = Ad
        fields = ('id', 'title', 'description', 'image_url', 'type')


class AdSerializerList(serializers.ModelSerializer):
    class Meta:
        model = Ad
        fields = ('title', 'description', 'image', 'type')


class CampaignAddActionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ActionBeacon
        fields = ('id', 'beacon', 'ad')

    def get_fields(self):
        fields = super(CampaignAddActionSerializer, self).get_fields()
        if len(self.context) == 0:
            return fields
        request = self.context['view'].request
        user = request.user
        fields['beacon'].queryset = user.beacons
        if not user:
            return fields
        get = request._request.resolver_match.kwargs.get('pk')
        fields['ad'].queryset = get_object_or_404(Campaign, pk=get).ads
        return fields


class BeaconActionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ad
        fields = ('title', '')


class ActionSerializer(ModelSerializer):
    class Meta:
        model = ActionBeacon
        fields = ('id', 'beacon', 'ad')