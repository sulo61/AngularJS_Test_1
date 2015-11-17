import json
from rest_framework.exceptions import ValidationError
from beacons.utils import get_api_key, get_user_from_api_key
from django.contrib.auth.decorators import permission_required
from django.contrib.auth.models import Permission
from django.contrib.contenttypes.models import ContentType
from django.core.cache import cache
from django.shortcuts import render, redirect
from rest_framework.authentication import SessionAuthentication, TokenAuthentication, BaseAuthentication
from rest_framework.authtoken import views
from rest_framework.authtoken.models import Token
from rest_framework.authtoken.views import ObtainAuthToken
from beacons.permissions import IsCampaignOwner, IsAdOwner, IsActionOwner, IsOperator, SdkPermission
from rest_framework import status
from rest_framework.decorators import detail_route, api_view, authentication_classes
from rest_framework.generics import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet
from beacons.models import Campaign, Beacon, Shop, Ad, Award, UserCampaign, Promotion
from beacons.serializers import TokenSerializer, UserAwardDetail, PromotionImageSerializer
from beacons.serializers import BeaconSerializer, CampaignSerializer, ShopSerializer, AdSerializerCreate, \
    CampaignAddActionSerializer, ActionSerializer, PromotionsSerializer, PromotionSerializerGet, AwardSerializerGet, \
    AwardSerializer, ShopImageSerializer, AwardImageSerializer, AdImageSerializer
from beacons.serializers import UserSerializer, UserProfileSerializer
from django.contrib.auth import get_user_model, login, authenticate, update_session_auth_hash

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
def campaignActions(request):
    return render(request, 'Panel/Campaign/Actions/actions.html', {})


@api_view(('GET',))
@authentication_classes((SessionAuthentication, BaseAuthentication))
def campaignAwards(request):
    return render(request, 'Panel/Campaign/Awards/awards.html', {})


@api_view(('GET',))
@authentication_classes((SessionAuthentication, BaseAuthentication))
def campaignBeacons(request):
    return render(request, 'Panel/Campaign/Beacons/beacons.html', {})


@api_view(('GET',))
@authentication_classes((SessionAuthentication, BaseAuthentication))
def campaignAward(request):
    return render(request, 'Panel/Campaign/Awards/Award/award.html', {})


@api_view(('GET',))
@authentication_classes((SessionAuthentication, BaseAuthentication))
def campaignAd(request):
    return render(request, 'Panel/Campaign/Ads/Ad/ad.html', {})


@api_view(('GET',))
@authentication_classes((SessionAuthentication, BaseAuthentication))
def campaignAction(request):
    return render(request, 'Panel/Campaign/Actions/Action/action.html', {})


@api_view(('GET',))
def index(request):
    if request.user.is_authenticated():
        return redirect('/panel/#/campaigns')
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
        'api_key': get_api_key(user)
    }
    return Response(map)


class UserProfileCRUD(ModelViewSet):
    authentication_classes = (SessionAuthentication, TokenAuthentication)
    queryset = User.objects.all()
    serializer_class = UserProfileSerializer

    def perform_update(self, serializer):
        super(UserProfileCRUD, self).perform_update(serializer)

        # if 'password' in serializer.initial_data and 'old_password' in serializer.initial_data:


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
        token, created = Token.objects.get_or_create(user=user)
        return Response({'token': token.key})


class CampaignView(ModelViewSet):
    serializer_class = CampaignSerializer
    permission_classes = (IsAuthenticated, IsOperator)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    def get_queryset(self):
        return self.request.user.campaigns.all()


class CampaignRetrieveView(ModelViewSet):
    serializer_class = CampaignSerializer
    permission_classes = (IsAuthenticated, IsOperator)

    def get_permissions(self):
        if self.request.method == 'GET':
            self.permission_classes = (IsAuthenticated,)

        return super(CampaignRetrieveView, self).get_permissions()

    def get_queryset(self):
        return self.request.user.campaigns.all()

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)

        user_campaign, created = UserCampaign.objects.get_or_create(campaign=instance, user=request.user)
        data = serializer.data
        data['user_points'] = user_campaign.user_points
        return Response(data)


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
        return self.get_campaign().beacons.all().order_by('minor')

    def list(self, request, *args, **kwargs):
        '''
        ---
        parameters:
            - name: pagination
              description: Turning on / off pagination. Default false.
              required: false
              type: string
              paramType: query
        '''
        if request.query_params.get('pagination', 'false') == 'true':
            pass
        elif request.query_params.get('pagination', 'false') == 'false':
            self.pagination_class = None
        else:
            raise ValidationError({
                'pagination': ['Pagination value should be true or false.']
            })

        return super(CampaignBeaconView, self).list(request, *args, **kwargs)


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
    count_beacons = len(campaign.beacons.all())
    if count_beacons < count:
        for x in xrange(count_beacons, int(count)):
            create = Beacon.objects.create(campaign=campaign)
            create.minor = x
            create.major = request.user.pk
            create.save()

    elif count_beacons > count:
        for beacon in campaign.beacons.all().order_by('minor').reverse()[:(count_beacons - count)]:
            beacon.delete()

    serializer = BeaconSerializer(instance=campaign.beacons.all(), many=True)
    return Response(serializer.data, status.HTTP_200_OK)


class BeaconCampaignActionView(ModelViewSet):
    serializer_class = BeaconSerializer
    permission_classes = (IsAuthenticated, SdkPermission)

    def get_campaign(self):
        obj = get_object_or_404(Campaign, pk=self.kwargs.get('pk'))
        return obj

    def get_object(self):
        obj = get_object_or_404(self.get_queryset(), minor=self.request.query_params.get('minor'),
                                major=self.request.query_params.get('major'))
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

    def retrieve(self, request, *args, **kwargs):
        """
        ---
        parameters:
            - name: minor
              type: integer
              paramType: query
            - name: major
              type: integer
              paramType: query

        type:
            id:
                required: true
                type: integer
            user_points:
                required: true
                type: integer
            title:
                required: true
                type: sting
            minor:
                required: true
                type: integer
            major:
                required: true
                type: integer
            messages:
                required: true
                type: array(string)
         """
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        data = serializer.data
        messages = []
        user_campaign, created = UserCampaign.objects.get_or_create(campaign=self.get_campaign(), user=request.user)
        for action in instance.actions.all():
            limit_key = 'user_action_points_time_limit_user_id_{0}_action_id_{1}'
            if not cache.get(limit_key.format(request.user.pk, action.pk)):
                user_campaign.user_points += action.points
                messages.append('You gathered {0} POINTS'.format(action.points))
                cache.set(limit_key.format(request.user.pk, action.pk), True, action.time_limit)

        user_campaign.save()
        data['user_points'] = user_campaign.user_points
        data['messages'] = messages
        return Response(data)


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

    def get_permissions(self):
        if self.request.method == 'GET':
            self.permission_classes = (IsAuthenticated,)
        else:
            self.permission_classes = (IsAuthenticated, IsOperator)

        return super(ShopView, self).get_permissions()

    def create(self, request, *args, **kwargs):
        '''
        Create shops with opening hours.
        \n\nissue:\n
        days should be array of integers:
            "days" : [1,2,3,4,5,6,7]

         ---


         omit_parameters:
            - name
            - opening_hours
            - address
         parameters:
            -   name: body
                pytype: ShopSerializer
                paramType: body

         response_serializer: beacons.serializers.ShopSerializer
         omit_parameters:
            - form

        '''
        return super(ShopView, self).create(request, *args, **kwargs)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    def get_queryset(self):
        if 'HTTP_API_KEY' in self.request.META:
            api_key = self.request.META['HTTP_API_KEY']
            return get_user_from_api_key(api_key).shops.all()
        else:
            return self.request.user.shops.all()


class CampaignAdView(ModelViewSet):
    permission_classes = (IsAuthenticated,)
    serializer_class = AdSerializerCreate

    def get_permissions(self):
        if self.request.method == 'POST':
            self.permission_classes = (IsAuthenticated, IsOperator)

        return super(CampaignAdView, self).get_permissions()

    def get_object(self):
        return get_object_or_404(Ad, pk=self.kwargs.get('ad_pk'))

    def get_campaign(self):
        return get_object_or_404(Campaign, pk=self.kwargs.get('pk'))

    def perform_create(self, serializer):
        serializer.save(campaign=self.get_campaign())

    def get_queryset(self):
        return self.get_campaign().ads.all()

    def list(self, request, *args, **kwargs):
        '''
        ---
        parameters:
            - name: pagination
              description: Turning on / off pagination. Default true.
              required: false
              type: string
              paramType: query
        '''
        if request.query_params.get('pagination', 'true') == 'true':
            pass
        elif request.query_params.get('pagination', 'true') == 'false':
            self.pagination_class = None
        else:
            raise ValidationError({
                'pagination': ['Pagination value should be true or false.']
            })
        return super(CampaignAdView, self).list(request, *args, **kwargs)


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

    def list(self, request, *args, **kwargs):
        '''
        ---
        parameters:
            - name: pagination
              description: Turning on / off pagination. Default true.
              required: false
              type: string
              paramType: query
        '''
        if request.query_params.get('pagination', 'true') == 'true':
            pass
        elif request.query_params.get('pagination', 'true') == 'false':
            self.pagination_class = None
        else:
            raise ValidationError({
                'pagination': ['Pagination value should be one of true or false.']
            })

        return super(CampaignAddAction, self).list(request, *args, **kwargs)


class ActionView(ModelViewSet):
    serializer_class = ActionSerializer
    permission_classes = (IsActionOwner,)

    def get_object(self):
        return get_object_or_404(self.get_campaign().actions.all(), pk=self.kwargs.get('action_pk'))

    def get_campaign(self):
        return get_object_or_404(Campaign, pk=self.kwargs.get('pk'))

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)

        user_campaign, created = UserCampaign.objects.get_or_create(campaign=self.get_campaign(), user=request.user)
        data = serializer.data
        data['user_points'] = user_campaign.user_points
        return Response(data)


class AdViewRetrieve(ModelViewSet):
    serializer_class = AdSerializerCreate
    permission_classes = (IsAdOwner,)

    def get_object(self):
        campaign = get_object_or_404(Campaign, pk=self.kwargs.get('pk'))
        action_pl = self.kwargs.get('ad_pk')
        return campaign.ads.get(pk=action_pl)


class PromotionCreateView(ModelViewSet):
    def get_permissions(self):
        if self.request.method == 'GET':
            self.permission_classes = (IsAuthenticated,)
        else:
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
        if self.request.method == 'GET':
            self.permission_classes = (IsAuthenticated,)
        else:
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
    serializer_class = AwardSerializerGet
    permission_classes = (IsAuthenticated,)

    def get_permissions(self):
        if self.request.method == 'GET':
            self.permission_classes = (IsAuthenticated,)
        else:
            self.permission_classes = (IsAuthenticated, IsOperator)

        return super(AwardCreateView, self).get_permissions()

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
            return Response(status=status.HTTP_200_OK, data={'image': shop.image.url})
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
            return Response(status=status.HTTP_200_OK, data={'image': shop.image.url})
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
            return Response(status=status.HTTP_200_OK, data={'image': shop.image.url})
        else:
            return super(AwardImageUpdater, self).create(request, *args, **kwargs)


class ShopBeacons(ModelViewSet):
    serializer_class = BeaconSerializer
    permission_classes = (IsAuthenticated, IsOperator)

    def get_queryset(self):
        return get_object_or_404(self.request.user.shops.all(), pk=self.kwargs.get('pk')).beacons.all()

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class AwardUserDetailsView(ModelViewSet):
    serializer_class = UserAwardDetail
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        promotions_all = get_object_or_404(Campaign, pk=self.kwargs.get('pk')).awards.all()
        return promotions_all

    def get_object(self):
        return get_object_or_404(self.get_queryset(), pk=self.kwargs.get('award_pk'))


class CampaignActive(APIView):
    permission_classes = (IsAuthenticated, SdkPermission)

    def get(self, request, format=None):
        '''
        ---
        parameters:
            - name: Api-Key
              description: mobile_api_key
              required: true
              type: string
              paramType: header
        '''
        api_key = request.META['HTTP_API_KEY']
        user = get_user_from_api_key(api_key)
        campaigns = user.campaigns.all()
        for campaign in campaigns:
            if campaign.is_active_campaign():
                serializer = CampaignSerializer(instance=campaign)
                user_campaign, created = UserCampaign.objects.get_or_create(campaign=campaign, user=request.user)
                data = serializer.data
                data['user_points'] = user_campaign.user_points
                return Response(data=data, status=status.HTTP_200_OK)

        return Response(data=[], status=status.HTTP_200_OK)


class CampaignCopyBeacons(APIView):
    def post(self, request, pk, format=None):
        campaign = get_object_or_404(request.user.campaigns.all(), pk=pk)
        if len(campaign.beacons.all()) == 0:
            for beacon in request.user.beacons.all():
                Beacon.objects.create(minor=beacon.minor,
                                      major=beacon.major,
                                      title=beacon.title,
                                      campaign=campaign)

            serializer = BeaconSerializer(instance=campaign.beacons.all(), many=True)
            return Response(status=status.HTTP_201_CREATED, data=serializer.data)
        return Response(status=status.HTTP_400_BAD_REQUEST, data={'non_field_error': ['campaign has beacons already']})


class PromotionImageUpdater(ModelViewSet):
    permission_classes = (IsAuthenticated, IsOperator,)

    serializer_class = PromotionImageSerializer

    def get_queryset(self):
        return get_object_or_404(Campaign, pk=self.kwargs.get('pk')).promotions.all()

    def create(self, request, *args, **kwargs):
        if 'image' in request.FILES:

            promotion = get_object_or_404(Promotion, pk=kwargs.get('promotion_pk'))
            upload = request.FILES['image']

            promotion.image.delete()
            promotion.image.save(upload.name, upload)
            return Response(status=status.HTTP_200_OK, data={'image': promotion.image.url})
        else:
            return super(PromotionImageUpdater, self).create(request, *args, **kwargs)
