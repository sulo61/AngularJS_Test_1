import json
from django.test import TestCase

# Create your tests here.
from beacons.serializers import ShopSerializer
from rest_framework import status
from rest_auth.tests import APIClient
from django.core.wsgi import get_wsgi_application

application = get_wsgi_application()

test_json = {
    "name": "Hello",
    "opening_hours": [{"days": [1, 2, 3], "open_time": "09:00:00.000000", "close_time": "20:00:00.000000"},
                      {"days": [4, 5, 6, 7], "open_time": "09:00:00.000000", "close_time": "20:00:00.000000"}]
}


class ValidationTest(TestCase):
    def test3_validation(self):
        serializer = ShopSerializer()
        self.assertTrue(serializer.valid_days(test_json.pop('opening_hours')), "Should be true")


class UserRegisterCase(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_register(self):
        register_data = {
            'email': 'mcol@gmail.com',
            'password': 'mcol',
        }

        response = self.client.post('/register/', register_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        loads = json.loads(response.content)
        self.assertEqual(loads, {
            u"id": loads.get('id'),
            u"email": u"mcol@gmail.com",
            u"first_name": u'',
            u"last_name": u'',
            u"address": u''
        })


def register(client):
    register_data = {
        'email': 'mcol@gmail.com',
        'password': 'mcol',
    }
    response = client.post('/register/', register_data, format='json')
    return register_data, response


class UserLoginCase(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_register(self):
        register_data, response = register(self.client)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        response = self.client.post('/login/', register_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        loads = json.loads(response.content)
        self.assertTrue('token' in loads)




class UserPermissionsCase(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_register(self):
        response = self.client.get('/campaigns/', format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_user(self):
        register_data, response = register(self.client)
        response = self.client.get('/user/27/', format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)