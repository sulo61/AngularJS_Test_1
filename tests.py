import json
from django.core.wsgi import get_wsgi_application

from django.test import TestCase


# Create your tests here.
from rest_framework import status
from rest_framework.test import APIClient

get_wsgi_application()


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


register_data = {
    'email': 'mcol@gmail.com',
    'password': 'mcol',
}


def register(client):
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
        register(self.client)

    def test_register(self):
        response = self.client.get('/campaigns/', format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_user_not_login_in(self):
        register_data, response = register(self.client)
        response = self.client.get('/user/1/', format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


class UserCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        data, response = register(self.client)
        data = json.loads(response.content)
        self.user_id = data.get('id')
        self.assertTrue(self.client.login(email=register_data.get('email'),
                                          password=register_data.get('password')), 'Didnt login in')

    def test_user_not_login_in(self):
        response = self.client.get('/user/', format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_user_update(self):
        data = {
            "first_name": "Xxxx",
            "last_name": "Zzzz",
            "address": "Ssss"
        }
        response = self.client.patch('/user/{0}/'.format(self.user_id), data=data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(json.loads(response.content), data)
