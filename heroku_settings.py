__author__ = 'Mateusz'


# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = '&upe5i5s@743&(y9*f!4+7=#%hjko0notm8&u_$l*061$c2om%eloelo333!#@'


# Database
# https://docs.djangoproject.com/en/1.8/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': 'd3sba0c5rafj0p',
        'USER': 'kezihectgicapy',
        'PASSWORD': 'un7Ooxekw4BjUpT4R8GWv4NtMl',
        'HOST': 'ec2-54-195-252-202.eu-west-1.compute.amazonaws.com',
        'PORT': '5432',
    }
}

# Parse database configuration from $DATABASE_URL
import dj_database_url
DATABASES['default'] =  dj_database_url.config()

# Honor the 'X-Forwarded-Proto' header for request.is_secure()
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')

# Allow all host headers
ALLOWED_HOSTS = ['*']

# Static asset configuration
import os
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
STATIC_ROOT = 'images'
STATIC_URL = '/images/'

STATICFILES_DIRS = (
    os.path.join(BASE_DIR, 'images'),
)