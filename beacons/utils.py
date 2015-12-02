from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from itsdangerous import URLSafeSerializer, BadSignature
from rest_framework.exceptions import NotFound
import settings

__author__ = 'Mateusz'
serializer = URLSafeSerializer(settings.SECRET_KEY)

User = get_user_model()


def get_api_key(user):
    return serializer.dumps('{0}_{1}'.format(user.pk, user.email))


def get_user_from_api_key(api_key):
    try:
        load = serializer.loads(api_key)
    except BadSignature:
        return None
    pk = load.split('_')
    if len(pk) != 2:
        raise NotFound()
    return get_object_or_404(User, pk=pk[0], email=pk[1])


def get_api_key_from_request(request):
    return request.META.get('HTTP_API_KEY', None)