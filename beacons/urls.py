from django.conf.urls import url, include
from rest_framework.urlpatterns import format_suffix_patterns
from beacons import views
from beacons.views import CreateViewUser, ObtainToken, UserProfileCRUD, LogoutView, CreateViewOperator, UserBeaconsView, \
    ShopBeacons

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

get_retrieve = {
    'post': 'create',
    'get': 'retrieve'
}

urlpatterns = [

    url(r'^operator/register/$', views.CreateViewOperator.as_view({'post': 'create'}), name='register_operator'),
    url(r'^login/token/', ObtainToken.as_view(), name="login"),
    url(r'^login/', views.login_view, name="login"),
    url(r'^logout/&', LogoutView.as_view(), name="login"),
    url(r'^register/$', CreateViewUser.as_view({'post': 'create'}), name='register'),

    url(r'^user/$', views.get_user, name='user'),
    url(r'^user/(?P<pk>[0-9]+)/$', UserProfileCRUD.as_view(retrieve), name='user'),
    url(r'^beacons/$', UserBeaconsView.as_view(methods), name='beacons'),
    url(r'^beacons/(?P<pk>[0-9]+)/$', UserBeaconsView.as_view(retrieve), name='beacons_details'),

    url(r'campaigns/(?P<pk>[0-9]+)/beacons$', views.BeaconCampaignView.as_view(retrieve),
        name="beacons"),

    url(r'campaigns/(?P<pk>[0-9]+)/$', views.CampaignRetrieveView.as_view(retrieve),
        name="campaign"),
    url(r'campaigns/(?P<pk>[0-9]+)/actions/(?P<action_pk>[0-9]+)/$', views.ActionView.as_view(retrieve),
        name="campaign-action"),
    url(r'campaigns/(?P<pk>[0-9]+)/actions/$', views.CampaignAddAction.as_view(methods), name="campaign-actions"),
    url(r'campaigns/(?P<pk>[0-9]+)/ads/$', views.CampaignAdView.as_view(methods), name="campaign-ads"),
    url(r'campaigns/(?P<pk>[0-9]+)/ads/(?P<ad_pk>[0-9]+)/$', views.AdViewRetrieve.as_view(retrieve),
        name="campaign-ads"),
    url(r'campaigns/(?P<pk>[0-9]+)/ads/(?P<ad_pk>[0-9]+)/image$', views.AdImageUpdater.as_view(get_retrieve),
        name="campaign-ads"),

    url(r'campaigns/(?P<pk>[0-9]+)/beacons/$', views.CampaignBeaconView.as_view({'get': 'list'}),
        name="campaign-beacon"),
    url(r'campaigns/(?P<pk>[0-9]+)/create_beacons/$', views.create_beacons, name="campaign-beacon"),
    url(r'campaigns/(?P<pk>[0-9]+)/beacons/import/$', views.CampaignCopyBeacons.as_view(), name="campaign-beacon"),
    url(r'campaigns/(?P<pk>[0-9]+)/beacons/(?P<beacon_id>[0-9]+)/$',
        views.BeaconCampaignView.as_view(retrieve),
        name="beacon"),

    url(r'campaigns/(?P<pk>[0-9]+)/action/$',
        views.BeaconCampaignActionView.as_view({'get' : 'retrieve'}),
        name="beacon"),

    url(r'campaigns/$', views.CampaignView.as_view(methods), name="campaigns"),
    url(r'campaigns/active/$', views.CampaignActive.as_view(), name="campaign_active"),

    url(r'shops/$', views.ShopView.as_view(methods), name="shops"),
    url(r'shops/(?P<pk>[0-9]+)/$', views.ShopView.as_view(retrieve), name="shops"),
    url(r'shops/(?P<pk>[0-9]+)/beacons/$', ShopBeacons.as_view(methods), name="shop_beacons"),
    url(r'shops/(?P<pk>[0-9]+)/image/$', views.ImageUpdater.as_view(get_retrieve), name="shops"),

    url(r'^auth/', include('rest_framework.urls', namespace='rest_framework')),

    url(r'campaigns/(?P<pk>[0-9]+)/promotions/$', views.PromotionView.as_view(methods), name='promotions'),
    url(r'campaigns/(?P<pk>[0-9]+)/promotions/(?P<promotion_pk>[0-9]+)/$', views.PromotionCreateView.as_view(retrieve),
        name='promotions_crud'),

    url(r'campaigns/(?P<pk>[0-9]+)/awards/$', views.AwardView.as_view(methods), name='promotions'),
    url(r'campaigns/(?P<pk>[0-9]+)/awards/(?P<award_pk>[0-9]+)/$', views.AwardCreateView.as_view(retrieve),
        name='promotions_crud'),
    url(r'campaigns/(?P<pk>[0-9]+)/awards/(?P<award_pk>[0-9]+)/update/$',
        views.AwardUserDetailsView.as_view({'get': 'retrieve', 'patch': 'update', }),
        name='promotions_crud'),

    url(r'campaigns/(?P<pk>[0-9]+)/awards/(?P<award_pk>[0-9]+)/image/$', views.AwardImageUpdater.as_view(get_retrieve),
        name='promotions_crud'),
]
retrieve_only = {'get': 'retrieve', }

urlpatterns = format_suffix_patterns(urlpatterns)
