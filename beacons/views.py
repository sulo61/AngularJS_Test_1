import json
from boto.cognito.identity.exceptions import NotAuthorizedException
from django.contrib.auth.decorators import permission_required

from django.contrib.auth.models import Permission
from django.contrib.contenttypes.models import ContentType
from django.shortcuts import render, redirect
from rest_framework.authentication import SessionAuthentication, TokenAuthentication, BaseAuthentication
from rest_framework.authtoken import views
from rest_framework.authtoken.models import Token
from rest_framework.authtoken.views import ObtainAuthToken
from beacons.permissions import IsCampaignOwner, IsAdOwner, IsActionOwner, IsOperator
from rest_framework import status
from rest_framework.decorators import detail_route, api_view, authentication_classes
from rest_framework.generics import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet
from beacons.models import Campaign, Beacon, Shop, Ad, Award, UserAwards
from beacons.serializers import CampaignSerializerPatch, TokenSerializer
from beacons.serializers import BeaconSerializer, CampaignSerializer, ShopSerializer, AdSerializerCreate, \
    CampaignAddActionSerializer, ActionSerializer, PromotionsSerializer, PromotionSerializerGet, AwardSerializerGet, \
    AwardSerializer, ShopImageSerializer, AwardImageSerializer, AdImageSerializer
from beacons.serializers import AdSerializerList, UserSerializer, UserProfileView
from django.contrib.auth import get_user_model, login, authenticate

User = get_user_model()

from django.contrib.auth import logout

from rest_framework import permissions


class LogoutView(views.APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, format=None):
        logout(request)
        return Response({}, status=status.HTTP_204_NO_CONTENT)


@api_view(('GET',))
@authentication_classes((SessionAuthentication, BaseAuthentication))
def dashCampaigns(request):
    return render(request, 'Panel/Dashboard/campaigns.html', {})

@api_view(('GET',))
@authentication_classes((SessionAuthentication, BaseAuthentication))
def dashShops(request):
    return render(request, 'Panel/Dashboard/shops.html', {})

@api_view(('GET',))
@authentication_classes((SessionAuthentication, BaseAuthentication))
def dashProfile(request):
    return render(request, 'Panel/Dashboard/profile.html', {})

@api_view(('GET',))
@authentication_classes((SessionAuthentication, BaseAuthentication))
def dashBeacons(request):
    return render(request, 'Panel/Dashboard/beacons.html', {})

@api_view(('GET',))
@authentication_classes((SessionAuthentication, BaseAuthentication))
def panel(request):
    return render(request, 'Panel/panel.html', {})

@api_view(('GET',))
@authentication_classes((SessionAuthentication, BaseAuthentication))
def shop(request):
    return render(request, 'Panel/Shop/shop.html', {})

@api_view(('GET',))
@authentication_classes((SessionAuthentication, BaseAuthentication))
def campaignMenu(request):
    return render(request, 'Panel/Campaign/Menu/menu.html', {})

@api_view(('GET',))
@authentication_classes((SessionAuthentication, BaseAuthentication))
def campaign(request):
    return render(request, 'Panel/Campaign/campaign.html', {})

@api_view(('GET',))
@authentication_classes((SessionAuthentication, BaseAuthentication))
def campaignBasic(request):
    return render(request, 'Panel/Campaign/Basic/basic.html', {})

@api_view(('GET',))
@authentication_classes((SessionAuthentication, BaseAuthentication))
def campaignAds(request):
    return render(request, 'Panel/Campaign/Ads/ads.html', {})

@api_view(('GET',))
@authentication_classes((SessionAuthentication, BaseAuthentication))
def campaignSce(request):
    return render(request, 'Panel/Campaign/Sce/sce.html', {})

@api_view(('GET',))
@authentication_classes((SessionAuthentication, BaseAuthentication))
def campaignAwards(request):
    return render(request, 'Panel/Campaign/Awards/awards.html', {})



@api_view(('GET',))
def index(request):
    if request.user.is_authenticated():
        return redirect('/panel/')
    else:
        return render(request, 'Auth/auth.html', {})




class CreateViewUser(ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def post_save(self, obj, created=False):
        token = Token.objects.create(user=obj)
        obj.key = token


class CreateViewOperator(ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def perform_create(self, serializer):
        user = serializer.save()
        token = Token.objects.create(user=user)
        user.key = token
        user.is_operator = True
        content_type = ContentType.objects.get_for_model(User)
        permission, created = Permission.objects.get_or_create(name='operator',
                                                               content_type=content_type,
                                                               codename='is_operator')
        user.user_permissions.add(permission)
        user.save()


@api_view(('GET',))
@authentication_classes((SessionAuthentication, TokenAuthentication, BaseAuthentication))
def get_user(request, format=None):
    user = request.user
    map = {
        'id': user.pk,
        'last_name': user.last_name,
        'first_name': user.first_name,
        'email': user.email,
        'address': user.address,
    }
    return Response(map)


class UserProfileCRUD(ModelViewSet):
    authentication_classes = (SessionAuthentication, TokenAuthentication)
    queryset = User.objects.all()
    serializer_class = UserProfileView


class UserProfile(APIView):
    authentication_classes = (SessionAuthentication, TokenAuthentication)

    def get(self, request, format=None):
        map = {}
        user = request.user
        map['last_name'] = user.last_name
        map['first_name'] = user.first_name
        map['email'] = user.email
        return Response(map)


@api_view(('POST',))
def login_view(request):
    username = request.data['email']
    password = request.data['password']
    user = authenticate(username=username, password=password)
    if user is not None:
        login(request, user)
        return Response(status=status.HTTP_200_OK)
    else:
        return Response(status=status.HTTP_400_BAD_REQUEST, data={'non_field_error': 'Bad credentials'})


class ObtainToken(ObtainAuthToken):
    """
        Obtain user token
    """

    serializer_class = TokenSerializer

    def post(self, request):
        """
        ---
        parameters:
            - name: email
              description: User name
              required: true
              type: string

            - name: password
              description: User password
              required: true
              type: string
        type:
            token:
                description: User token
                type: string
        """
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        authenticate(email=user.email, password=user.password)
        login(request, user)
        token, created = Token.objects.get_or_create(user=user)
        return Response({'token': token.key})


class CampaignView(ModelViewSet):
    serializer_class = CampaignSerializer
    permission_classes = (IsAuthenticated, IsOperator)

    @detail_route(methods=['post'])
    def create(self, request, pk=None):
        serializer = CampaignSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(owner=request.user)
            return Response(serializer.data)
        else:
            return Response(serializer.errors,
                            status=status.HTTP_400_BAD_REQUEST)

    def get_queryset(self):
        return self.request.user.campaigns.all()


class CampaignRetrieveView(ModelViewSet):
    permission_classes = (IsAuthenticated, IsOperator)

    def get_serializer_class(self):
        if self.request.method == 'PATCH':
            return CampaignSerializerPatch
        else:
            return CampaignSerializer

    def get_queryset(self):
        return self.request.user.campaigns.all()


class CampaignBeaconView(ModelViewSet):
    serializer_class = BeaconSerializer
    permission_classes = (IsAuthenticated, IsCampaignOwner, IsOperator)

    def get_campaign(self):
        campaign = get_object_or_404(Campaign, pk=self.kwargs['pk'])
        self.check_object_permissions(self.request, campaign)
        return campaign

    def get_object(self):
        return get_object_or_404(self.queryset, pk=self.kwargs['beacon_id'])

    def create(self, request, pk=None):
        serializer = BeaconSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(campaign=self.get_object())
            return Response(serializer.data)
        else:
            return Response(serializer.errors,
                            status=status.HTTP_400_BAD_REQUEST)

    def get_queryset(self):
        return self.get_campaign().beacons.all()


@api_view(('Post',))
@authentication_classes((SessionAuthentication, TokenAuthentication, BaseAuthentication))
def create_beacons(request, format=None):
    user = request.user
    map = {
        'id': user.pk,
        'last_name': user.last_name,
        'first_name': user.first_name,
        'email': user.email,
        'address': user.address,
    }
    return Response(map)


@api_view(('Post',))
@authentication_classes((SessionAuthentication, TokenAuthentication, BaseAuthentication))
@permission_required('beacons.is_operator')
def create_beacons(request, pk, format=None):
    '''
    ---
     parameters:
        - name: count
          description: How many beacons should be created
          required: true
          type: int
          paramType: form
        # - name: other_foo
        #   paramType: query
        # - name: other_bar
        #   paramType: query
        # - name: avatar
        #   type: file
    '''
    campaign = get_object_or_404(Campaign, pk=pk)
    count = request.data.get('count', 0)
    beacons = []
    for x in xrange(int(count)):
        create = Beacon.objects.create(campaign=campaign)
        create.minor = x
        create.major = request.user.pk
        create.save()
        beacons.append({
            'id': create.pk,
            'minor': create.minor,
            'major': create.major,
        })
    return Response(json.dumps(list(beacons)))


class BeaconCampaignView(ModelViewSet):
    serializer_class = BeaconSerializer
    # TODO: perrmission is operator and owner of campaign
    permission_classes = (IsAuthenticated, IsOperator)

    def get_campaign(self):
        obj = get_object_or_404(Campaign, pk=self.kwargs.get('pk'))
        return obj

    def get_object(self):
        obj = get_object_or_404(self.get_queryset(), pk=self.kwargs.get('beacon_id'))
        return obj

    def create(self, request, *args, **kwargs):
        serializer = BeaconSerializer(data=request.data)
        if serializer.is_valid():
            count = serializer.data.get('beacons_count', 0)
            beacons = []
            for x in xrange(count):
                create = Beacon.objects.create(campaign=self.get_object())
                create.minor = x
                create.major = request.user.pk
                create.save()
                beacons.append({
                    'id': create.pk,
                    'minor': create.minor,
                    'major': create.major,
                })
            return Response(json.dumps(list(beacons)))
        else:
            return Response(serializer.errors,
                            status=status.HTTP_400_BAD_REQUEST)

    def get_queryset(self):
        return self.get_campaign().beacons.all()


class ShopView(ModelViewSet):
    serializer_class = ShopSerializer
    permission_classes = (IsAuthenticated,)

    @detail_route(methods=['post'])
    def create(self, request, pk=None):
        '''
         {
          "name": "Zara",
          "opening_hours": [
            {
              "days": [
                1,
                2,
                3,
                4,
                5,
                6,
                7
              ],
              "open_time": "10:00:00",
              "close_time": "20:00:00"
            }
          ],
          "address": "Krakusa 8",
          "latitude": 15,
          "longitude": 15
         }
        '''
        serializer = ShopSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(owner=request.user)
            return Response(status=status.HTTP_201_CREATED, data=serializer.data)
        else:
            return Response(serializer.errors,
                            status=status.HTTP_400_BAD_REQUEST)

    def get_queryset(self):
        return Shop.objects.all()

    def update(self, request, *args, **kwargs):
        request._data = request.data
        request._full_data = request.data
        return super(ShopView, self).update(request, *args, **kwargs)


class CampaignAdView(ModelViewSet):
    permission_classes = (IsAuthenticated,)

    def get_permissions(self):
        if self.request.method == 'POST':
            self.permission_classes = (IsAuthenticated, IsOperator)

        return super(CampaignAdView, self).get_permissions()

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return AdSerializerList
        elif self.request.method == 'GET':
            return AdSerializerCreate

    def get_object(self):
        obj = get_object_or_404(Campaign, pk=self.kwargs.get('pk'))
        self.check_object_permissions(self.request, obj)
        return obj

    def create(self, request, *args, **kwargs):
        serializer = AdSerializerList(data=request.data)
        if serializer.is_valid():
            serializer.save(campaign=self.get_object())
            return Response(serializer.data)
        else:
            return Response(serializer.errors,
                            status=status.HTTP_400_BAD_REQUEST)

            # TODO: change adds to ads

    def get_queryset(self):
        return self.get_object().ads.all()


class CampaignAddAction(ModelViewSet):
    serializer_class = CampaignAddActionSerializer
    permission_classes = (IsAdOwner, IsOperator)

    def get_object(self):
        obj = get_object_or_404(Campaign, pk=self.kwargs.get('pk'))
        self.check_object_permissions(self.request, obj)
        return obj

    def perform_create(self, serializer):
        serializer.save(campaign=self.get_object())

    def get_queryset(self):
        return self.get_object().actions.all()


class ActionView(ModelViewSet):
    serializer_class = ActionSerializer
    permission_classes = (IsActionOwner,)

    def get_object(self):
        campaign = get_object_or_404(Campaign, pk=self.kwargs.get('pk'))
        action_pl = self.kwargs.get('action_pk')
        actions_get = campaign.actions.get(pk=action_pl)
        return actions_get


class AdViewRetrieve(ModelViewSet):
    serializer_class = AdSerializerCreate
    permission_classes = (IsAdOwner,)

    def get_object(self):
        campaign = get_object_or_404(Campaign, pk=self.kwargs.get('pk'))
        action_pl = self.kwargs.get('ad_pk')
        return campaign.ads.get(pk=action_pl)


class PromotionCreateView(ModelViewSet):
    permission_classes = (IsAuthenticated,)

    def get_permissions(self):
        if self.request.method == 'POST':
            self.permission_classes = (IsAuthenticated, IsOperator)

        return super(PromotionCreateView, self).get_permissions()

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return PromotionSerializerGet
        else:
            return PromotionSerializerGet

    def get_queryset(self):
        promotions_all = get_object_or_404(Campaign, pk=self.kwargs.get('pk')).promotions.all()
        return promotions_all

    def get_object(self):
        return get_object_or_404(self.get_queryset(), pk=self.kwargs.get('promotion_pk'))


class PromotionView(PromotionCreateView):
    permission_classes = (IsAuthenticated,)

    def get_permissions(self):
        if self.request.method == 'POST':
            self.permission_classes = (IsAuthenticated, IsOperator)

        return super(PromotionView, self).get_permissions()

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return PromotionSerializerGet
        else:
            return PromotionsSerializer

    def get_object(self):
        query_set = get_object_or_404(Campaign, pk=self.kwargs.get('pk'))
        return query_set

    def perform_create(self, serializer):
        serializer.save(campaign=self.get_object())


class AwardCreateView(ModelViewSet):
    permission_classes = (IsAuthenticated,)

    def get_permissions(self):
        if self.request.method == 'POST':
            self.permission_classes = (IsAuthenticated, IsOperator)

        return super(AwardCreateView, self).get_permissions()

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return AwardSerializerGet
        else:
            return AwardSerializerGet

    def get_queryset(self):
        promotions_all = get_object_or_404(Campaign, pk=self.kwargs.get('pk')).awards.all()
        return promotions_all

    def get_object(self):
        return get_object_or_404(self.get_queryset(), pk=self.kwargs.get('award_pk'))


class AwardView(AwardCreateView):
    permission_classes = (IsAuthenticated,)

    def get_permissions(self):
        if self.request.method == 'POST':
            self.permission_classes = (IsAuthenticated, IsOperator)

        return super(AwardView, self).get_permissions()

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return AwardSerializerGet
        else:
            return AwardSerializer

    def get_object(self):
        campaign = get_object_or_404(Campaign, pk=self.kwargs.get('pk'))
        return campaign

    def perform_create(self, serializer):
        serializer.save(campaign=self.get_object())


class ImageUpdater(ModelViewSet):
    permission_classes = (IsAuthenticated, IsOperator,)
    serializer_class = ShopImageSerializer

    def get_queryset(self):
        return self.request.user.shops.all()

    def create(self, request, *args, **kwargs):
        if 'image' in request.FILES:

            shop = get_object_or_404(Shop, pk=kwargs.get('pk'))
            upload = request.FILES['image']

            shop.image.delete()
            shop.image.save(upload.name, upload)
            return Response(status=status.HTTP_200_OK)
        else:
            return super(ImageUpdater, self).create(request, *args, **kwargs)


class AdImageUpdater(ModelViewSet):
    permission_classes = (IsAuthenticated, IsOperator,)
    serializer_class = AdImageSerializer

    def get_queryset(self):
        return get_object_or_404(Campaign, pk=self.kwargs.get('pk')).ads.all()

    def create(self, request, *args, **kwargs):
        if 'image' in request.FILES:

            shop = get_object_or_404(Ad, pk=kwargs.get('ad_pk'))
            upload = request.FILES['image']

            shop.image.delete()
            shop.image.save(upload.name, upload)
            return Response(status=status.HTTP_200_OK)
        else:
            return super(AdImageUpdater, self).create(request, *args, **kwargs)


class AwardImageUpdater(ModelViewSet):
    permission_classes = (IsAuthenticated, IsOperator,)
    serializer_class = AwardImageSerializer

    def get_queryset(self):
        return get_object_or_404(Campaign, pk=self.kwargs.get('pk')).awards.all()

    def create(self, request, *args, **kwargs):
        if 'image' in request.FILES:

            shop = get_object_or_404(Award, pk=kwargs.get('award_pk'))
            upload = request.FILES['image']

            shop.image.delete()
            shop.image.save(upload.name, upload)
            return Response(status=status.HTTP_200_OK)
        else:
            return super(AwardImageUpdater, self).create(request, *args, **kwargs)
