import os
from settings import BASE_DIR

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

DATABASES['default'] = dj_database_url.config()

# Honor the 'X-Forwarded-Proto' header for request.is_secure()
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')

# Allow all host headers
ALLOWED_HOSTS = ['*']

AWS_STORAGE_BUCKET_NAME = 'beacons-project'
AWS_ACCESS_KEY_ID = 'AKIAJEMTKLDCTAFSKB7A'
AWS_SECRET_ACCESS_KEY = '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'

AWS_S3_CUSTOM_DOMAIN = '%s.s3.amazonaws.com' % AWS_STORAGE_BUCKET_NAME

AWS_HEADERS = {  # see http://developer.yahoo.com/performance/rules.html#expires
                 'Expires': 'Thu, 31 Dec 2099 20:00:00 GMT',
                 'Cache-Control': 'max-age=94608000',
                 }

# media
MEDIAFILES_LOCATION = 'media'
MEDIA_URL = "https://{0}/{1}/".format(
    AWS_S3_CUSTOM_DOMAIN, MEDIAFILES_LOCATION)
DEFAULT_FILE_STORAGE = 'custom_storages.MediaStorage'

AWS_STORAGE_BUCKET_NAME = 'beacons-project'

# static
# STATICFILES_LOCATION = 'static'
# STATICFILES_STORAGE = 'custom_storages.StaticStorage'
# STATIC_URL = "https://%s/%s/" % (AWS_S3_CUSTOM_DOMAIN, STATICFILES_LOCATION)


TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR, 'static/templates')]
        ,
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]