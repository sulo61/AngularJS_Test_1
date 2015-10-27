import json
from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient
from tests.test_utils import register_login_user

__author__ = 'Mateusz'

register_data = {
    'email': 'user_normal@gmail.com',
    'password': 'mcol',
}


def register(client):
    response = client.post('/register/', register_data, format='json')
    return json.loads(response.content).get('id')


def create_campaign(self):
    client = APIClient()
    data = {
        'email': 'operator@gmail.com',
        'password': 'operator',
    }
    client.post('/operator/register/', data, format='json')
    client.login(email=data.get('email'), password=data.get('password'))

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


class UserRegisterCase(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_register(self):
        response = self.client.post('/register/', register_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        loads = json.loads(response.content)
        self.assertEqual(loads, {
            u"id": loads.get('id'),
            u"email": u"user_normal@gmail.com",
            u"first_name": u'',
            u"last_name": u'',
            u"address": u''
        })


class UserLoginCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        register(self.client)

    def test_login(self):
        response = self.client.post('/login/', register_data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class UserGETMethods(TestCase):
    def setUp(self):
        self.campaign_id = create_campaign(self)
        self.client = APIClient()
        register(self.client)
        self.client.login(email=register_data.get('email'), password=register_data.get('password'))

    def test_get_ads(self):
        response = self.client.get('/campaigns/{0}/ads/'.format(self.campaign_id))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_promotions(self):
        response = self.client.get('/campaigns/{0}/promotions/'.format(self.campaign_id))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_awards(self):
        response = self.client.get('/campaigns/{0}/awards/'.format(self.campaign_id))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_shops(self):
        response = self.client.get('/shops/'.format(self.campaign_id))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_beacons(self):
        response = self.client.get('/campaigns/{0}/beacons/'.format(self.campaign_id))
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_get_actions(self):
        response = self.client.get('/campaigns/{0}/actions/'.format(self.campaign_id))
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)


class UserCreateCampaign(TestCase):
    def setUp(self):
        register_login_user(self)
        self.id = create_campaign(self)

    def test_create_campaign(self):
        data = {
            'name': 'Name',
            "start_date": "2015-10-23T08:00:00Z",
            "end_date": "2015-10-31T09:00:00Z"
        }

        response = self.client.post('/campaigns/', data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_create_ads(self):
        data = {
            'title': 'Name',
            "start_date": "2015-10-23T08:00:00Z",
            "end_date": "2015-10-31T09:00:00Z"
        }

        response = self.client.post('/campaigns/{0}/ads/'.format(self.id), data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
