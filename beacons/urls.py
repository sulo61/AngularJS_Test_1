from django.conf.urls import url, include
from rest_framework.urlpatterns import format_suffix_patterns
from beacons import views

__author__ = 'Mateusz'

methods = {
    'get': 'list',
    'post': 'create',
}
urlpatterns = [
    url(r'beacons/', views.BeaconView.as_view(methods), name="beacons"),
    url(r'campaigns/(?P<pk>[0-9]+)/beacons', views.CampaignBeaconView.as_view(methods), name="campaign-beacon"),
    url(r'campaigns/', views.CampaignView.as_view(methods), name="campaigns"),



    url(r'^auth/', include('rest_framework.urls', namespace='rest_framework')),
]

urlpatterns = format_suffix_patterns(urlpatterns)
