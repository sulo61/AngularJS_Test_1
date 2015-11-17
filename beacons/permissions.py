from beacons.models import Campaign
from beacons.utils import get_user_from_api_key, get_api_key_from_request
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


class IsOperator(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user is not None and request.user.has_perm('beacons.is_operator')


class SdkPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        api_key = get_api_key_from_request(request)
        return api_key is not None and get_user_from_api_key(api_key) is not None
