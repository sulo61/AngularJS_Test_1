import json
from rest_framework import status
from rest_framework.test import APIClient

__author__ = 'Mateusz'

register_data = {
    'email': 'user_normal@gmail.com',
    'password': 'user',
}


def register_login_user(self):
    self.client.post('/api/register/', register_data, format='json')
    is_login_in = self.client.login(email=register_data.get('email'), password=register_data.get('password'))
    self.assertTrue(is_login_in)


register_operator_data = {
    'email': 'user_normal@gmail.com',
    'password': 'user',
}


def register_login_operator(self):
    response = self.client.post('/api/operator/register/', register_operator_data, format='json')
    self.assertEqual(response.status_code, status.HTTP_201_CREATED)
    self.client.login(email=register_operator_data.get('email'), password=register_operator_data.get('password'))


def register_login_operator_return(self):
    client = APIClient()
    response = client.post('/api/operator/register/', register_operator_data, format='json')
    self.assertEqual(response.status_code, status.HTTP_201_CREATED)
    client.login(email=register_operator_data.get('email'), password=register_operator_data.get('password'))
    return client


def create_campaign(self, client, active=False):
    data = {
        'name': 'Name',
        "start_date": "2015-10-23T08:00:00Z",
        "end_date": "2015-10-31T09:00:00Z",
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
                'start_date': "2015-10-23T08:00:00Z",
                "end_date": "2015-10-31T09:00:00Z",
                u'is_active': active,
            }]})
    return id


def create_add(self, campaign_id, client_operator):
    data = {
        'title': 'Title',
        "description": "description",
        "type": 1,
    }
    response = client_operator.post('/api/campaigns/{0}/ads/'.format(campaign_id), data=data, format='json')
    self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    return response.data.get('id')


def create_action(self):
    data = {
        'count': 5
    }
    response = self.client_operator.post(u'/api/campaigns/{0}/create_beacons/'.format(self.campaign_id), data=data,
                                         format='json')
    beacon_id = response.data[0].get('id')
    data = {
        'beacon': beacon_id,
        'ad': self.ad_id,
        'points': 1000,
        'time_limit': 1000
    }
    response = self.client_operator.post('/api/campaigns/{0}/actions/'.format(self.campaign_id), data=data)
    self.assertEquals(response.status_code, status.HTTP_201_CREATED)
    return response.data.get('id')


def get_api_key(self, operator_client):
    response = operator_client.get('/api/user/', format='json')
    self.assertEqual(response.status_code, status.HTTP_200_OK)
    self.assertIsNotNone(response.content, 'User data are unavailable')
    response_data = json.loads(response.content)
    self.assertTrue('api_key' in response_data)
    return response_data['api_key']


def generate_api_key_header(param):
    return {'HTTP_API_KEY': param}
