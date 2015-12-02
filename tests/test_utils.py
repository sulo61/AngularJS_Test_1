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
