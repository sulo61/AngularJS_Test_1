from beacons.models import Campaign
from rest_framework import permissions

__author__ = 'Mateusz'


class IsCampaignOwner(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if isinstance(obj, Campaign):
            return obj.owner == request.user
        else:
            return obj.campaign.owner == request.user

class IsBeaconOwner(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.user == request.user


class IsAdOwner(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if isinstance(obj, Campaign):
            return obj.owner == request.user
        else:
            return request.user == obj.campaign.owner


class IsActionOwner(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return request.user == obj.campaign.owner

