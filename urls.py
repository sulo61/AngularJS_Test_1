"""beacons URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.8/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Add an import:  from blog import urls as blog_urls
    2. Add a URL to urlpatterns:  url(r'^blog/', include(blog_urls))
"""
from django.conf.urls import include, url
from django.contrib import admin
from django.shortcuts import render, redirect
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.reverse import reverse

urlpatterns = [
    url(r'^admin/', include(admin.site.urls)),
    url(r'^', include('beacons.urls')),
]


@api_view(('GET',))
def api_root(request, format=None):
    return Response({
        'login': reverse('login', request=request, format=format),
        'user': reverse('user', request=request, format=format),
        'register': reverse('register', request=request, format=format),
        'shops': reverse('shops', request=request, format=format),
        'campaigns': reverse('campaigns', request=request, format=format),
        'docs': reverse('django.swagger.base.view', request=request, format=format),
    })


@api_view(('GET',))
def index(request):
    if request.user.is_authenticated():
        return redirect('/dashboard/')
    else:
        return render(request, 'Auth/auth.html', {})


@api_view(('GET',))
def dashboard(request):
    return render(request, 'Panel/Dashboard/dashboard.html')


urlpatterns += [
    url(r'^api_docs/', include('rest_framework_swagger.urls'), name="docs"),
    url(r'^$', index),
    url(r'^dashboard/$', dashboard),
    url(r'^rest_framework/$', api_root),

]
