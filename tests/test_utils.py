from rest_framework import status

__author__ = 'Mateusz'

register_data = {
    'email': 'user_normal@gmail.com',
    'password': 'user',
}


def register_login_user(self):
    response = self.client.post('/api/register/', register_data, format='json')
    self.assertEqual(response.status_code, status.HTTP_201_CREATED)
    self.client.login(email=register_data.get('email'), password=register_data.get('password'))


register_operator_data = {
    'email': 'user_normal@gmail.com',
    'password': 'user',
}


def register_login_operator(self):
    response = self.client.post('/api/operator/register/', register_operator_data, format='json')
    self.assertEqual(response.status_code, status.HTTP_201_CREATED)
    self.client.login(email=register_operator_data.get('email'), password=register_operator_data.get('password'))
