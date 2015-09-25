from django.conf.urls import url, include
from rest_framework.urlpatterns import format_suffix_patterns
from beacons import views

__author__ = 'Mateusz'

list_ = {
    'get': 'list',
    'post': 'create',
}
urlpatterns = [
    url(r'beacons/', views.CreateBeacon.as_view(list_), name="beacons"),
    url(r'^auth/', include('rest_framework.urls', namespace='rest_framework')),
]

urlpatterns = format_suffix_patterns(urlpatterns)
