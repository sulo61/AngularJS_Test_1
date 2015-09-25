from django.shortcuts import render
from rest_framework import serializers
from rest_framework.decorators import api_view

from rest_framework.reverse import reverse

from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet, ModelViewSet
from beacons.models import Beacon


class BeaconSerializer(serializers.ModelSerializer):
    class Meta:
        model = Beacon
        fields = ('title',)

class CreateBeacon(ModelViewSet):
    serializer_class = BeaconSerializer
    queryset = Beacon.objects.all()

    def create(self, request, *args, **kwargs):
        return super(CreateBeacon, self).create(request, *args, **kwargs)
