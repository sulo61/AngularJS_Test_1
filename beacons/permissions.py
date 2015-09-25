from rest_framework import permissions

__author__ = 'Mateusz'


class IsOwner(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.owner == request.user

