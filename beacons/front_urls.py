from beacons import views
from django.conf.urls import url, include
from rest_framework.urlpatterns import format_suffix_patterns

__author__ = 'Mateusz'

urlpatterns = [
    url(r'^api_docs/', include('rest_framework_swagger.urls'), name="docs"),
    url(r'^dash/profile/$', views.dashProfile, name="dashProfile"),
    url(r'^dash/shops/$', views.dashShops, name="dashShops"),
    url(r'^dash/campaigns/$', views.dashCampaigns, name="dashCampaigns"),
    url(r'^panel/$', views.panel, name="panel"),

    url(r'^shop/$', views.shop, name="shop"),
    url(r'^campaign/$', views.campaign, name="campaign"),
    url(r'^campaign/basic/$', views.campaignBasic, name="campaignBasic"),

    url(r'^campaign/ads/$', views.campaignAds, name="campaignAds"),
    url(r'^campaign/ad/$', views.campaignAd, name="campaignAd"),
    
    url(r'^campaign/actions/$', views.campaignActions, name="campaignActions"),
    url(r'^campaign/action/$', views.campaignAction, name="campaignAction"),
    
    url(r'^campaign/awards/$', views.campaignAwards, name="campaignAwards"),
    url(r'^campaign/award/$', views.campaignAward, name="campaignAward"),

    url(r'^campaign/promotions/$', views.campaignPromotions, name="campaignPromotions"),
    url(r'^campaign/promotion/$', views.campaignPromotion, name="campaignPromotion"),

    url(r'^campaign/beacons/$', views.campaignBeacons, name="campaignBeacons"),
    
    url(r'^panel/campaign/menu/$', views.campaignMenu, name="campaignMenu"),

    
    url(r'^login/', views.login_view, name="login"),
    url(r'^logout', views.LogoutView.as_view(), name="login"),

]

urlpatterns = format_suffix_patterns(urlpatterns)
