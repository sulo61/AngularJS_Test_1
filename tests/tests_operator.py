# coding=utf-8
import json
from django.test import TestCase
# Create your tests here.
from rest_framework import status
from rest_framework.test import APIClient
from tests.test_utils import register_data


class UserRegisterCase(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_register(self):
        response = self.client.post('/api/register/', register_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        loads = json.loads(response.content)
        self.assertEqual(loads, {
            u"id": loads.get('id'),
            u"email": u"user_normal@gmail.com",
            u"first_name": u'',
            u"last_name": u'',
            u"address": u''
        })


class OperatorRegisterCase(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_register(self):
        register_data = {
            'email': 'mcol@gmail.com',
            'password': 'mcol',
        }

        response = self.client.post('/api/operator/register/', register_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        loads = json.loads(response.content)
        self.assertEqual(loads, {
            u"id": loads.get('id'),
            u"email": u"mcol@gmail.com",
            u"first_name": u'',
            u"last_name": u'',
            u"address": u''
        })


register_operator_data = {
    'email': 'operator@gmail.com',
    'password': 'operator',
}


def register_operator(client):
    response = client.post('/api/operator/register/', register_operator_data, format='json')
    data = json.loads(response.content)
    user_id = data.get('id')
    return response, user_id


class UserLoginCase(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_register(self):
        response, id = register_operator(self.client)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        response = self.client.post('/api/login/token/', register_operator_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        loads = json.loads(response.content)
        self.assertTrue('token' in loads)


class UserPermissionsCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        register_operator(self.client)

    def test_register(self):
        response = self.client.get('/api/campaigns/', format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_user_not_login_in(self):
        response, id = register_operator(self.client)
        response = self.client.get('/api/user/1/', format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


class UserCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        response, id = register_operator(self.client)
        data = json.loads(response.content)
        self.user_id = data.get('id')
        self.assertTrue(self.client.login(email=register_operator_data.get('email'),
                                          password=register_operator_data.get('password')), 'Didnt login in')

    def test_user_not_login_in(self):
        response = self.client.get('/api/user/', format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_user_update(self):
        data = {
            u'address': "Ssss",
            u'email': u'operator@gmail.com',
            u'first_name': "Xxxx",
            u'id': self.user_id,
            u'last_name': "Zzzz",
        }

        update_data = {
            u"first_name": u"Xxxx",
            u"last_name": u"Zzzz",
            u"address": u"Ssss",
            u'password': register_operator_data.get('password'),
            u'old_password': register_operator_data.get('password')
        }

        response = self.client.patch('/api/user/{0}/'.format(self.user_id), data=update_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(json.loads(response.content), data)


class TestCampaign(TestCase):
    def setUp(self):
        self.client = APIClient()
        response, self.id = register_operator(client=self.client)
        self.client.login(email=register_operator_data.get('email'), password=register_operator_data.get('password'))

    def test_campaign(self):
        response = self.client.get('/api/campaigns/')
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

        response = client.post('/api/campaigns/', data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_create_campaign_no_data(self):
        data = {
        }

        response = self.client.post('/api/campaigns/', data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


def create_campaign(self, client):
    data = {
        'name': 'Name',
        "start_date": "2015-10-23T08:00:00Z",
        "end_date": "2015-10-31T09:00:00Z",
        u'is_active': False,
    }
    response = client.post('/api/campaigns/', data)
    self.assertEqual(response.status_code, status.HTTP_201_CREATED)
    campaign = json.loads(response.content)
    id = campaign.get('id')
    data['id'] = id
    self.assertEqual(campaign, data)
    response = client.get('/api/campaigns/')
    self.assertEqual(response.status_code, status.HTTP_200_OK)
    self.assertEqual(json.loads(response.content), {
        "count": 1, "next": None,
        "previous": None,
        "results": [
            {
                "id": id,
                "name": "Name",
                'start_date': "2015-10-23T08:00:00Z",
                "end_date": "2015-10-31T09:00:00Z",
                u'is_active': False
            }]})
    return id


class ShopTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        response, self.id = register_operator(client=self.client)
        loged_in = self.client.login(email=register_operator_data.get('email'),
                                     password=register_operator_data.get('password'))
        self.assertTrue(loged_in, 'Didn\'t logged in')

    def test_get_shops(self):
        response = self.client.get('/api/shops/')
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
                    "open_time": "10:00",
                    "close_time": "20:00"
                }
            ],
            "address": "Some Street",
            "latitude": 15.0,
            "longitude": 15.0
        }

        response = self.client.post('/api/shops/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        shop = json.loads(response.content)
        data['id'] = shop.get('id')
        data['image'] = None
        self.assertEqual(shop, data)

    def test_update_shop(self):
        shop_id = self.create_shop()
        data_patch = {
            "name": "Shop Name Updated",
            "opening_hours": [
                {
                    "days": [
                        1,
                        2,
                        3,
                        4,
                        5
                    ],
                    "open_time": "12:00",
                    "close_time": "22:00"
                }, {
                    "days": [
                        6,
                        7
                    ],
                    "open_time": "12:00",
                    "close_time": "22:00"
                }
            ],
            "address": "Some Street 2",
            "latitude": 30.0,
            "longitude": 30.0
        }
        response = self.client.patch('/api/shops/{0}/'.format(shop_id), data_patch, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_update_shop_more_days(self):
        shop_id = self.create_shop()
        data_patch = {
            "name": "Shop Name Updated",
            "opening_hours": [
                {
                    "days": [
                        1,
                        2,
                        3,
                        4,
                        5
                    ],
                    "open_time": "12:00",
                    "close_time": "22:00"
                }, {
                    "days": [
                        6
                    ],
                    "open_time": "12:00",
                    "close_time": "22:00"
                }, {
                    "days": [
                        7
                    ],
                    "open_time": "12:00",
                    "close_time": "22:00"
                }
            ],
            "address": "Some Street 2",
            "latitude": 30.0,
            "longitude": 30.0
        }
        response = self.client.patch('/api/shops/{0}/'.format(shop_id), data_patch, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data_patch['id'] = shop_id
        data_patch['image'] = None
        self.assertEqual(json.loads(response.content), data_patch)

    def test_update_shop_less_days(self):
        shop_id = self.create_shop()
        data_patch = {
            "name": "Shop Name Updated",
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
                    "open_time": "12:00",
                    "close_time": "22:00"
                }
            ],
            "address": "Some Street 2",
            "latitude": 30.0,
            "longitude": 30.0
        }
        response = self.client.patch('/api/shops/{0}/'.format(shop_id), data_patch, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data_patch['id'] = shop_id
        data_patch['image'] = None
        self.assertEqual(json.loads(response.content), data_patch)

    def create_shop(self):
        data = {
            "name": "Shop Name Updated",
            "opening_hours": [
                {
                    "days": [
                        1,
                        2,
                        3,
                        4,
                        5
                    ],
                    "open_time": "12:00",
                    "close_time": "22:00"
                }, {
                    "days": [
                        6,
                        7
                    ],
                    "open_time": "12:00",
                    "close_time": "22:00"
                }
            ],
            "address": "Some Street 2",
            "latitude": 30.0,
            "longitude": 30.0
        }
        response = self.client.post('/api/shops/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        shop = json.loads(response.content)
        id = shop.get('id')
        return id

    def test_opening_hours_nullable(self):
        data = {
            "name": "Nowy sklep",
            "opening_hours": [
                {
                    "days": [
                        1,
                        2,
                        3
                    ],

                    "open_time": "08:00",
                    "close_time": "18:00"
                },
                {
                    "days": [
                        4,
                        5,
                        6,
                        7
                    ],

                    "open_time": None,
                    "close_time": None
                }
            ],
            "address": u'Złota podkowa 33 1',
            "latitude": 51.655457,
            "longitude": 16.1067049
        }

        id = self.create_shop()
        response = self.client.patch('/api/shops/{0}/'.format(id), data, format='json')
        self.assertEquals(response.status_code, status.HTTP_200_OK)


class Awards(TestCase):
    def setUp(self):
        self.client = APIClient()
        response, self.id = register_operator(client=self.client)
        loged_in = self.client.login(email=register_operator_data.get('email'),
                                     password=register_operator_data.get('password'))
        self.assertTrue(loged_in, 'Didn\'t logged in')
        self.campaign_id = create_campaign(self, client=self.client)

    def test_awards_list(self):
        response = self.client.get('/api/campaigns/{0}/awards/'.format(self.campaign_id), format=json)
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class Promotions(TestCase):
    def setUp(self):
        self.client = APIClient()
        response, self.id = register_operator(client=self.client)
        loged_in = self.client.login(email=register_operator_data.get('email'),
                                     password=register_operator_data.get('password'))
        self.assertTrue(loged_in, 'Didn\'t logged in')
        self.campaign_id = create_campaign(self, client=self.client)

    def test_promotions_list(self):
        response = self.client.get('/api/campaigns/{0}/promotions/'.format(self.campaign_id), format=json)
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class Beacons(TestCase):
    def setUp(self):
        self.client = APIClient()
        response, self.id = register_operator(client=self.client)
        loged_in = self.client.login(email=register_operator_data.get('email'),
                                     password=register_operator_data.get('password'))
        self.assertTrue(loged_in, 'Didn\'t logged in')
        self.campaign_id = create_campaign(self, client=self.client)

    def test_beacons_list(self):
        response = self.client.get('/api/campaigns/{0}/beacons/'.format(self.campaign_id), format=json)
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class Ads(TestCase):
    def setUp(self):
        self.client = APIClient()
        response, self.id = register_operator(client=self.client)
        loged_in = self.client.login(email=register_operator_data.get('email'),
                                     password=register_operator_data.get('password'))
        self.assertTrue(loged_in, 'Didn\'t logged in')
        self.campaign_id = create_campaign(self, client=self.client)

    def test_beacons_list(self):
        response = self.client.get('/api/campaigns/{0}/ads/'.format(self.campaign_id), format=json)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
