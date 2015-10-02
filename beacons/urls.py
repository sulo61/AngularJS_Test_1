from django.conf.urls import url, include
from rest_framework.urlpatterns import format_suffix_patterns
from beacons import views

__author__ = 'Mateusz'

methods = {
    'get': 'list',
    'post': 'create',
}
retrieve = {'get': 'retrieve'}
urlpatterns = [
    url(r'campaigns/(?P<pk>[0-9]+)/$', views.CampaignRetrieveView.as_view({'get': 'retrieve', }),
        name="campaign"),
    url(r'campaigns/(?P<pk>[0-9]+)/actions/$', views.CampaignAddAction.as_view(methods), name="campaign-actions"),
    url(r'campaigns/(?P<pk>[0-9]+)/ads/$', views.CampaignAdView.as_view(methods), name="campaign-ads"),
    url(r'campaigns/(?P<pk>[0-9]+)/beacons/$', views.CampaignBeaconView.as_view(methods), name="campaign-beacon"),
    url(r'campaigns/(?P<pk>[0-9]+)/beacons/(?P<beacon_id>[0-9]+)/$',
        views.BeaconCampaignView.as_view({'get': 'retrieve', }),
        name="beacon"),
    url(r'campaigns/$', views.CampaignView.as_view(methods), name="campaigns"),
    url(r'shops/$', views.ShopView.as_view(methods), name="shops"),
    url(r'beacons/$', views.BeaconView.as_view(methods), name="beacons"),
    url(r'beacons/(?P<pk>[0-9]+)/action/$', views.BeaconRetrieve.as_view(retrieve), name="beacons"),
    # url(r'beacons/(?P<pk>[0-9]+)/$', views.BeaconRetrieve.as_view(retrieve), name="beacons"),

    url(r'^auth/', include('rest_framework.urls', namespace='rest_framework')),
]

urlpatterns = format_suffix_patterns(urlpatterns)
