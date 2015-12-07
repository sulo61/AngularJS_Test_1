import time

from django.contrib.auth import authenticate, logout, login
from django.http import Http404
from django.shortcuts import get_object_or_404
from django.utils.translation import ugettext_lazy as _
from rest_framework import exceptions, serializers
from rest_framework.exceptions import ValidationError
from rest_framework.relations import PrimaryKeyRelatedField
from rest_framework.serializers import ModelSerializer, IntegerField

from beacons.models import Beacon, Campaign, Shop, OpeningHours, Ad, ActionBeacon, Promotion, Award, BeaconUser, \
    UserAwards


class TokenSerializer(serializers.Serializer):
    email = serializers.CharField()
    password = serializers.CharField(style={'input_type': 'password'})

    def validate(self, attrs):
        username = attrs.get('email')
        password = attrs.get('password')

        if username and password:
            user = authenticate(username=username, password=password)

            if user:
                if not user.is_active:
                    msg = _('User account is disabled.')
                    raise exceptions.ValidationError(msg)
            else:
                msg = _('Unable to log in with provided credentials.')
                raise exceptions.ValidationError(msg)
        else:
            msg = _('Must include "email" and "password".')
            raise exceptions.ValidationError(msg)

        attrs['user'] = user
        return attrs


class UserSerializer(serializers.ModelSerializer):
    def create(self, validated_data):
        user = BeaconUser.objects.create(
            email=validated_data['email']
        )
        user.set_password(validated_data['password'])
        user.address = validated_data.get('address', '')
        user.first_name = validated_data.get('first_name', '')
        user.last_name = validated_data.get('last_name', '')
        user.last_name = validated_data.get('last_name', '')
        user.save()

        return user

    class Meta:
        model = BeaconUser
        fields = ("id", 'password', 'email', 'first_name', 'last_name', 'address')
        extra_kwargs = {
            'password': {'write_only': True},
        }
        read_only_fields = ('id',)


class UserProfileSerializer(serializers.ModelSerializer):
    def to_representation(self, value):
        return {
            'id': value.pk,
            'email': value.email,
            'first_name': value.first_name,
            'last_name': value.last_name,
            'address': value.address,
        }

    class Meta:
        model = BeaconUser
        fields = ('first_name', 'last_name', 'address',)
        read_only_fields = ('id',)

    def update(self, instance, validated_data):
        super(UserProfileSerializer, self).update(instance, validated_data)

        if 'password' in self.initial_data or 'old_password' in self.initial_data:
            if self.initial_data['password'] != '' and self.initial_data['old_password'] != '':
                if not ('password' in self.initial_data) and self.initial_data['password'] != '':
                    raise ValidationError({
                        'password': ['This field is required.']
                    })

                if not ('old_password' in self.initial_data) and self.initial_data['old_password'] != '':
                    raise ValidationError({
                        'old_password': ['This field is required.']
                    })

                password = self.initial_data.get('old_password', '')
                if not instance.check_password(password):
                    raise ValidationError({
                        'old_password': ['Entered password is not correct.']
                    })

                instance.set_password(self.initial_data.get('password'))
                instance.save()
                if 'request' in self.context:
                    logout(self.context['request'])
                    user = authenticate(email=instance.email, password=self.initial_data.get('password'))
                    if user is not None:
                        login(self.context['request'], user)

        return instance


class CountSerializer(serializers.Serializer):
    count = IntegerField()

    class Meta:
        fields = ('count',)


class BeaconSerializer(serializers.ModelSerializer):
    class Meta:
        model = Beacon
        fields = ('id', 'title', 'minor', 'major', 'UUID')


class CampaignSerializer(serializers.ModelSerializer):
    class Meta:
        model = Campaign
        fields = ('id', 'name', 'start_date', 'end_date', 'is_active')

    def validate(self, attrs):
        start_date = attrs['start_date']
        end_date = attrs['end_date']
        if end_date < start_date:
            raise ValidationError({
                'start_date': ['This field should be before end_date'],
                'end_date': ['This field should be after start_date']
            })

        return attrs


class OpeningHoursSerializer(serializers.ModelSerializer):
    class Meta:
        model = OpeningHours
        fields = ('days', 'open_time', 'close_time')


class ShopSerializer(serializers.HyperlinkedModelSerializer):
    opening_hours = OpeningHoursSerializer(many=True)

    class Meta:
        model = Shop
        fields = ('id', 'name', 'opening_hours', 'address', 'latitude', 'longitude', 'image')
        read_only_fields = ('image',)

    def create(self, validated_data):
        opening_hours_data = validated_data.pop('opening_hours')
        shop = Shop.objects.create(**validated_data)
        for opening_hours in opening_hours_data:
            OpeningHours.objects.create(shop=shop, **opening_hours)
        return shop

    def is_valid(self, raise_exception=False):
        valid = super(ShopSerializer, self).is_valid(raise_exception)
        opening_hours = self.initial_data.get('opening_hours')
        if valid:
            valid = self.valid_days(opening_hours)

        return valid

    def valid_days(self, opening_hours):
        if not opening_hours:
            raise ValidationError(detail={'opening_hours': ['This field is required']})
        hours_ = opening_hours[0]
        if hours_.get('days')[0] != 1:
            raise ValidationError(detail={'opening_hours': ['Days should starts with 1']})

        hours_last = opening_hours[-1]
        if hours_last.get('days')[-1] != 7:
            raise ValidationError(detail={'opening_hours': ['Days should ends with 7']})

        day_before = None
        for opening_hour in opening_hours:
            if not opening_hour:
                raise ValidationError(detail={'opening_hours': ['This field shouldn\'t be empty']})

            get = str(opening_hour.get('open_time'))
            if not (get == 'None' or get == ''):
                hour_get = str(opening_hour.get('close_time'))
                if not (hour_get == 'None' or hour_get == ''):
                    if time.strptime(get, "%H:%M") >= \
                            time.strptime(hour_get, "%H:%M"):
                        raise ValidationError(detail={'open_hours': ['open_time should be before close_time']})

            for day in opening_hour.get('days'):
                if day_before is None:
                    day_before = day
                    continue
                if day != day_before + 1:
                    raise ValidationError(detail={'open_hours': ['Days should by ordered constantly form 1 to 7']})

                day_before = day
        return True

    def update(self, instance, validated_data):
        days_data = validated_data.pop('opening_hours')
        counter = 0
        opening_hours_len = len(instance.opening_hours.all())
        days_data_len = len(days_data)

        if opening_hours_len > days_data_len:
            for obj in instance.opening_hours.all()[days_data_len - 1:opening_hours_len - 1]:
                obj.delete()

        for openingHours in instance.opening_hours.all():
            openingHours.days = days_data[counter].get('days')
            openingHours.open_time = days_data[counter].get('open_time')
            openingHours.close_time = days_data[counter].get('close_time')
            openingHours.save()
            counter += 1

        if counter < days_data_len:
            for i in xrange(counter, days_data_len):
                OpeningHours.objects.create(
                    open_time=days_data[counter].get('open_time'),
                    close_time=days_data[counter].get('close_time'),
                    days=days_data[i].get('days'),
                    shop=instance)

        instance.longitude = validated_data.get('longitude')
        instance.name = validated_data.get('name')
        instance.latitude = validated_data.get('latitude')
        instance.address = validated_data.get('address')
        instance.save()
        return instance


class AdSerializerCreate(serializers.ModelSerializer):
    class Meta:
        model = Ad
        fields = ('id', 'title', 'description', 'image', 'type')
        read_only_fields = ('image',)


class CampaignAddActionSerializer(serializers.ModelSerializer):
    def get_fields(self):
        fields = super(CampaignAddActionSerializer, self).get_fields()
        if 'request' in self.context:
            if 'ad' in fields:
                fields['ad'].queryset = \
                    get_object_or_404(Campaign,
                                      pk=self.context['request'].parser_context.get('kwargs').get('pk')).ads.all()

            if 'beacon' in fields:
                fields['beacon'].queryset = \
                    get_object_or_404(Campaign,
                                      pk=self.context['request'].parser_context.get('kwargs').get('pk')).beacons.all()
        return fields

    def create(self, validated_data):
        if 'ad' in self.initial_data:
            validated_data['ad'] = get_object_or_404(Ad, pk=self.initial_data['ad'])
        return super(CampaignAddActionSerializer, self).create(validated_data)

    ad = PrimaryKeyRelatedField(many=False, queryset=Beacon.objects.all())

    class Meta:
        model = ActionBeacon
        fields = ('id', 'beacon', 'ad', 'points', 'time_limit')


class BeaconActionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ad
        fields = ('title', '')


class ActionSerializer(ModelSerializer):
    class Meta:
        model = ActionBeacon
        fields = ('id', 'beacon', 'ad', 'points', 'time_limit')


class PromotionSerializerGet(serializers.ModelSerializer):
    class Meta:
        model = Promotion
        fields = ('id', 'title', 'description', 'points', 'image')


class PromotionsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Promotion
        fields = ('id', 'title', 'description', 'image', 'points',)
        read_only_fields = ('image',)


class UserAwardSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserAwards
        fields = ('favourite', 'bought')


class AwardSerializerGet(serializers.ModelSerializer):
    class Meta:
        model = Award
        fields = ('id', 'title', 'description', 'points', 'image', 'type',)
        read_only_fields = ('image',)

    def favourite_method(self, obj):
        try:
            if 'request' in self.context:
                user_award = get_object_or_404(self.context['request'].user.user_awards.all(), award=obj)
                return user_award.favorite
        except Http404:
            return False

    def bought_method(self, obj):
        try:
            if 'request' in self.context:
                user_award = get_object_or_404(self.context['request'].user.user_awards.all(), award=obj)
                return user_award.bought
        except Http404:
            return False

    def to_representation(self, value):
        representation = super(AwardSerializerGet, self).to_representation(value)
        representation['favorite'] = self.favourite_method(value)
        representation['bought'] = self.bought_method(value)
        return representation

    def update(self, instance, validated_data):
        instance = super(AwardSerializerGet, self).update(instance, validated_data)
        if 'request' in self.context:
            award_favourite, created = UserAwards.objects.get_or_create(award=instance, user=self.context['request'].user)
            if 'favorite' in self.initial_data:
                award_favourite.favorite = self.initial_data.get('favorite')

            if 'bought' in self.initial_data:
                award_favourite.bought = self.initial_data.get('bought')

            award_favourite.save()
        return instance


class UserAwardDetail(serializers.ModelSerializer):
    class Meta:
        model = Award
        fields = ('id',)

    def favourite_method(self, obj):
        try:
            if 'request' in self.context:
                user_award = get_object_or_404(self.context['request'].user.user_awards.all(), award=obj)
                return user_award.favorite
        except Http404:
            return False

    def bought_method(self, obj):
        try:
            if 'request' in self.context:
                user_award = get_object_or_404(self.context['request'].user.user_awards.all(), award=obj)
                return user_award.bought
        except Http404:
            return False

    def to_representation(self, value):
        representation = {}
        representation['favorite'] = self.favourite_method(value)
        representation['bought'] = self.bought_method(value)
        return representation

    def update(self, instance, validated_data):
        if 'request' in self.context:
            award_favourite, created = UserAwards.objects.get_or_create(award=instance, user=self.context['request'].user)
            if 'favorite' in self.initial_data:
                award_favourite.favorite = self.initial_data.get('favorite')

            if 'bought' in self.initial_data:
                award_favourite.bought = self.initial_data.get('bought')

            award_favourite.save()
        return instance


class AwardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Award
        fields = ('id', 'title', 'description', 'image', 'points', 'type',)


class ShopImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Shop
        fields = ('image',)


class AdImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ad
        fields = ('image',)


class PromotionImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Promotion
        fields = ('image',)


class AwardImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Award
        fields = ('image',)
