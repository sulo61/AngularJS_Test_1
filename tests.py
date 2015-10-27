import json

from django.test import TestCase


# Create your tests here.
from rest_framework import status
from rest_framework.test import APIClient


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
    data = json.loads(response.content)
    user_id = data.get('id')
    return response, user_id


class UserLoginCase(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_register(self):
        response, id = register(self.client)

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
        response, id = register(self.client)
        response = self.client.get('/user/1/', format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


class UserCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        response, id = register(self.client)
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


class TestCampaign(TestCase):
    def setUp(self):
        self.client = APIClient()
        response, self.id = register(client=self.client)
        self.client.login(email=register_data.get('email'), password=register_data.get('password'))

    def test_campaign(self):
        response = self.client.get('/campaigns/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(json.loads(response.content), {"count": 0, "next": None, "previous": None, "results": []})

    def test_create_campaign(self):
        create_campaign(self, self.client)

    def test_create_campaign_unauthenticated(self):
        client = APIClient()
        data = {
            'name': 'Name',
            "start_date": "2015-10-23T08:00:00Z",
            "end_date": "2015-10-31T09:00:00Z"
        }

        response = client.post('/campaigns/', data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)


def create_campaign(self, client):
    data = {
        'name': 'Name',
        "start_date": "2015-10-23T08:00:00Z",
        "end_date": "2015-10-31T09:00:00Z"
    }
    response = client.post('/campaigns/', data)
    self.assertEqual(response.status_code, status.HTTP_200_OK)
    campaign = json.loads(response.content)
    id = campaign.get('id')
    data['id'] = id
    self.assertEqual(campaign, data)
    response = client.get('/campaigns/')
    self.assertEqual(response.status_code, status.HTTP_200_OK)
    self.assertEqual(json.loads(response.content), {
        "count": 1, "next": None,
        "previous": None,
        "results": [
            {
                "id": id,
                "name": "Name",
                'start_date': "2015-10-23T08:00:00Z",
                "end_date": "2015-10-31T09:00:00Z"
            }]})
    return id


class ShopTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        response, self.id = register(client=self.client)
        loged_in = self.client.login(email=register_data.get('email'), password=register_data.get('password'))
        self.assertTrue(loged_in, 'Didn\'t logged in')

    def test_get_shops(self):
        response = self.client.get('/shops/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(json.loads(response.content), {"count": 0, "next": None, "previous": None, "results": []})

    def test_create_shop(self):
        data = {
            "name": "Shop Name",
            "opening_hours": [
                {
                    "days": [
                        1,
                        2,
                        3,
                        4,
                        5,
                        6,
                        7
                    ],
                    "open_time": "10:00:00",
                    "close_time": "20:00:00"
                }
            ],
            "address": "Some Street",
            "latitude": 15.0,
            "longitude": 15.0
        }

        response = self.client.post('/shops/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        shop = json.loads(response.content)
        data['id'] = shop.get('id')
        data['image'] = None
        self.assertEqual(shop, data)


class Awards(TestCase):
    def setUp(self):
        self.client = APIClient()
        response, self.id = register(client=self.client)
        loged_in = self.client.login(email=register_data.get('email'), password=register_data.get('password'))
        self.assertTrue(loged_in, 'Didn\'t logged in')
        self.campaign_id = create_campaign(self, client=self.client)

    def test_awards_list (self):
        response = self.client.get('/campaigns/{0}/awards/'.format(self.campaign_id), format=json)
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class Promotions(TestCase):
    def setUp(self):
        self.client = APIClient()
        response, self.id = register(client=self.client)
        loged_in = self.client.login(email=register_data.get('email'), password=register_data.get('password'))
        self.assertTrue(loged_in, 'Didn\'t logged in')
        self.campaign_id = create_campaign(self, client=self.client)

    def test_promotions_list(self):
        response = self.client.get('/campaigns/{0}/promotions/'.format(self.campaign_id), format=json)
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class Beacons(TestCase):
    def setUp(self):
        self.client = APIClient()
        response, self.id = register(client=self.client)
        loged_in = self.client.login(email=register_data.get('email'), password=register_data.get('password'))
        self.assertTrue(loged_in, 'Didn\'t logged in')
        self.campaign_id = create_campaign(self, client=self.client)

    def test_beacons_list(self):
        response = self.client.get('/campaigns/{0}/beacons/'.format(self.campaign_id), format=json)
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class Ads(TestCase):
    def setUp(self):
        self.client = APIClient()
        response, self.id = register(client=self.client)
        loged_in = self.client.login(email=register_data.get('email'), password=register_data.get('password'))
        self.assertTrue(loged_in, 'Didn\'t logged in')
        self.campaign_id = create_campaign(self, client=self.client)

    def test_beacons_list(self):
        response = self.client.get('/campaigns/{0}/ads/'.format(self.campaign_id), format=json)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
