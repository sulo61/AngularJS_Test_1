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

# # Static asset configuration
# import os
# BASE_DIR = os.path.dirname(os.path.abspath(__file__))
# STATIC_ROOT = 'images'
# STATIC_URL = '/images/'
#
# STATICFILES_DIRS = (
#     os.path.join(BASE_DIR, 'images'),
# )

AWS_STORAGE_BUCKET_NAME = 'beacons-project'
AWS_ACCESS_KEY_ID = 'AKIAJEMTKLDCTAFSKB7A'
AWS_SECRET_ACCESS_KEY = '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'

# Tell django-storages that when coming up with the URL for an item in S3 storage, keep
# it simple - just use this domain plus the path. (If this isn't set, things get complicated).
# This controls how the `static` template tag from `staticfiles` gets expanded, if you're using it.
# We also use it in the next setting.
AWS_S3_CUSTOM_DOMAIN = '%s.s3.amazonaws.com' % AWS_STORAGE_BUCKET_NAME

# This is used by the `static` template tag from `static`, if you're using that. Or if anything else
# refers directly to STATIC_URL. So it's safest to always set it.
STATIC_URL = "https://%s/" % AWS_S3_CUSTOM_DOMAIN

# Tell the staticfiles app to use S3Boto storage when writing the collected static files (when
# you run `collectstatic`).
STATICFILES_STORAGE = 'storages.backends.s3boto.S3BotoStorage'

AWS_HEADERS = {  # see http://developer.yahoo.com/performance/rules.html#expires
                 'Expires': 'Thu, 31 Dec 2099 20:00:00 GMT',
                 'Cache-Control': 'max-age=94608000',
                 }

STATICFILES_LOCATION = 'static'
# STATICFILES_STORAGE = 'custom_storages.StaticStorage'
# STATIC_URL = "https://%s/%s/" % (AWS_S3_CUSTOM_DOMAIN, STATICFILES_LOCATION)
