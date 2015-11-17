import json
from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient
from tests import test_utils
from tests.test_utils import register_login_user

__author__ = 'Mateusz'

register_data = {
    'email': 'user_normal@gmail.com',
    'password': 'mcol',
}


def register(client):
    response = client.post('/api/register/', register_data, format='json')
    return json.loads(response.content).get('id')


def create_campaign(self, active=False):
    client = APIClient()
    data = {
        'email': 'operator@gmail.com',
        'password': 'operator',
    }
    client.post('/api/operator/register/', data, format='json')
    client.login(email=data.get('email'), password=data.get('password'))

    data = {
        'name': 'Name',
        "start_date": "2010-10-23T08:00:00Z",
        "end_date": "2020-10-31T09:00:00Z",
        u'is_active': active,
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
                'start_date': "2010-10-23T08:00:00Z",
                "end_date": "2020-10-31T09:00:00Z",
                u'is_active': active,
            }]})
    return id, client


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


class UserLoginCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        register(self.client)

    def test_login(self):
        response = self.client.post('/api/login/', register_data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class UserGETMethods(TestCase):
    def setUp(self):
        self.campaign_id, client = create_campaign(self)
        self.client = APIClient()
        register(self.client)
        self.client.login(email=register_data.get('email'), password=register_data.get('password'))

    def test_get_ads(self):
        response = self.client.get('/api/campaigns/{0}/ads/'.format(self.campaign_id))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_promotions(self):
        response = self.client.get('/api/campaigns/{0}/promotions/'.format(self.campaign_id))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_awards(self):
        response = self.client.get('/api/campaigns/{0}/awards/'.format(self.campaign_id))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_shops(self):
        response = self.client.get('/api/shops/'.format(self.campaign_id))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_beacons(self):
        response = self.client.get('/api/campaigns/{0}/beacons/'.format(self.campaign_id))
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_get_actions(self):
        response = self.client.get('/api/campaigns/{0}/actions/'.format(self.campaign_id))
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)


class UserCreateCampaign(TestCase):
    def setUp(self):
        register_login_user(self)
        self.id, client = create_campaign(self)

    def test_create_campaign(self):
        data = {
            'name': 'Name',
            "start_date": "2015-10-23T08:00:00Z",
            "end_date": "2015-10-31T09:00:00Z"
        }

        response = self.client.post('/api/campaigns/', data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_create_ads(self):
        data = {
            'title': 'Name',
            "start_date": "2015-10-23T08:00:00Z",
            "end_date": "2015-10-31T09:00:00Z"
        }

        response = self.client.post('/api/campaigns/{0}/ads/'.format(self.id), data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)


def create_award(self, campaign_id, client):
    response = client.post('/api/campaigns/{0}/awards/'.format(campaign_id), data={
        "title": "Test",
        "description": "test desc",
        "points": 10,
        "type": "1"
    }, format='json')
    self.assertEqual(response.status_code, status.HTTP_201_CREATED)
    return json.loads(response.content).get('id')


class UserAwardsDetails(TestCase):
    def setUp(self):
        self.client = APIClient()
        register_login_user(self)
        self.campaign_id, operator_client = create_campaign(self)
        self.award_id = create_award(self, self.campaign_id, operator_client)

    def test_update_award(self):
        response = self.client.patch('/api/campaigns/{0}/awards/{1}/update/'.format(self.campaign_id, self.award_id),
                                     data={
                                         'favorite': True,
                                         'bought': True
                                     }, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)


class SdkUserPermission(TestCase):
    def setUp(self):
        super(SdkUserPermission, self).setUp()
        self.operator_client = test_utils.register_login_operator_return(self)
        response = self.operator_client.get('/api/user/', format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIsNotNone(response.content, 'User data are unavailable')
        response_data = json.loads(response.content)
        self.assertTrue('api_key' in response_data)
        self.api_key = response_data['api_key']

        test_utils.register_login_user(self)
        self.campaign_id = test_utils.create_campaign(self, self.operator_client)

    def test_check_active_campaign_without_api_key(self):
        response = self.client.get('/api/campaigns/active/', format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_get_active_campaign_with_sdk(self):
        response = self.client.get('/api/campaigns/active/', format='json', **{'HTTP_API_KEY': self.api_key})
        self.assertEquals(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_get_active_campaign(self):
        create_campaign(self, active=True)
