from django.conf.urls import url, include
from rest_framework.urlpatterns import format_suffix_patterns
from beacons import views
from beacons.views import CreateViewUser, ObtainToken

__author__ = 'Mateusz'

methods = {
    'get': 'list',
    'post': 'create',
}
retrieve = {
    'delete': 'destroy',
    'get': 'retrieve',
    'patch': 'update',
}

urlpatterns = [
    url(r'^login/', ObtainToken.as_view(), name="login"),
    url(r'^register/$', CreateViewUser.as_view({'post': 'create'}), name='register'),
    url(r'campaigns/(?P<pk>[0-9]+)/$', views.CampaignRetrieveView.as_view({'get': 'retrieve', }),
        name="campaign"),
    url(r'campaigns/(?P<pk>[0-9]+)/actions/(?P<action_pk>[0-9]+)/$', views.ActionView.as_view(retrieve),
        name="campaign-action"),
    url(r'campaigns/(?P<pk>[0-9]+)/actions/$', views.CampaignAddAction.as_view(methods), name="campaign-actions"),
    url(r'campaigns/(?P<pk>[0-9]+)/ads/$', views.CampaignAdView.as_view(methods), name="campaign-ads"),
    url(r'campaigns/(?P<pk>[0-9]+)/ads/(?P<ad_pk>[0-9]+)/$', views.AdViewRetrieve.as_view(retrieve),
        name="campaign-ads"),

    url(r'campaigns/(?P<pk>[0-9]+)/beacons/$', views.CampaignBeaconView.as_view(methods), name="campaign-beacon"),
    url(r'campaigns/(?P<pk>[0-9]+)/beacons/(?P<beacon_id>[0-9]+)/$',
        views.BeaconCampaignView.as_view(retrieve),
        name="beacon"),
    url(r'campaigns/$', views.CampaignView.as_view(methods), name="campaigns"),
    url(r'shops/$', views.ShopView.as_view(methods), name="shops"),
    url(r'beacons/$', views.BeaconView.as_view(methods), name="beacons"),
    url(r'beacons/(?P<pk>[0-9]+)/action/$', views.BeaconRetrieve.as_view(retrieve), name="beacons"),
    # url(r'beacons/(?P<pk>[0-9]+)/$', views.BeaconRetrieve.as_view(retrieve), name="beacons"),

    url(r'^auth/', include('rest_framework.urls', namespace='rest_framework')),
]

urlpatterns = format_suffix_patterns(urlpatterns)
