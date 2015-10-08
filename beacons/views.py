from django.contrib.auth.models import User
from rest_framework.authentication import SessionAuthentication, TokenAuthentication, BaseAuthentication
from rest_framework.authtoken.models import Token
from rest_framework.authtoken.views import ObtainAuthToken

from beacons.permissions import IsCampaignOwner, IsAdOwner, IsActionOwner
from rest_framework import status
from rest_framework.decorators import detail_route, api_view, authentication_classes
from rest_framework.exceptions import NotFound
from rest_framework.generics import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from rest_framework.renderers import BaseRenderer
from rest_framework.response import Response
from rest_framework.status import HTTP_400_BAD_REQUEST, HTTP_201_CREATED
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet

from beacons.models import Campaign, Beacon, Shop, Ad
from beacons.serializers import BeaconSerializer, CampaignSerializer, ShopSerializer, AdSerializerCreate, \
    CampaignAddActionSerializer, ActionSerializer, PromotionsSerializer, PromotionSerializerGet, AwardSerializerGet, \
    AwardSerializer, ShopImageSerializer, AwardImageSerializer, ShopSerializerPOST
from beacons.serializers import AdSerializerList, \
    UserSerializer, UserProfileView


class CreateViewUser(ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def post_save(self, obj, created=False):
        token = Token.objects.create(user=obj)
        obj.key = token


@api_view(('GET',))
@authentication_classes((SessionAuthentication, TokenAuthentication, BaseAuthentication))
def get_user(request, format=None):
    user = request.user
    map = {
        'id': user.pk,
        'last_name': user.last_name,
        'first_name': user.first_name,
        'email': user.email,
    }
    return Response(map)


class UserProfileCRUD(ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserProfileView


class UserProfile(APIView):
    def get(self, request, format=None):
        map = {}
        user = request.user
        map['last_name'] = user.last_name
        map['first_name'] = user.first_name
        map['email'] = user.email
        return Response(map)


class ObtainToken(ObtainAuthToken):
    """
        Obtain user token
    """

    def post(self, request):
        """
        ---
        parameters:
            - name: username
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
        return super(ObtainToken, self).post(request)


class CampaignView(ModelViewSet):
    serializer_class = CampaignSerializer
    permission_classes = (IsAuthenticated,)

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
    serializer_class = CampaignSerializer

    def get_queryset(self):
        return self.request.user.campaigns.all()


class CampaignBeaconView(ModelViewSet):
    serializer_class = BeaconSerializer
    permission_classes = (IsAuthenticated, IsCampaignOwner)

    def get_object(self):
        obj = get_object_or_404(Campaign, pk=self.kwargs.get('pk'))
        self.check_object_permissions(self.request, obj)
        return obj

    @detail_route(methods=['post'])
    def create(self, request, pk=None):
        serializer = BeaconSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(campaign=self.get_object())
            return Response(serializer.data)
        else:
            return Response(serializer.errors,
                            status=status.HTTP_400_BAD_REQUEST)

    def get_queryset(self):
        return self.get_object().beacons.all()


class BeaconCampaignView(ModelViewSet):
    serializer_class = BeaconSerializer
    permission_classes = (IsAuthenticated,)

    def get_object(self):
        obj = get_object_or_404(Campaign, pk=self.kwargs.get('pk'))
        beacons_all = obj.beacons.all()
        all__filter = beacons_all.filter(campaign=obj, pk=self.kwargs.get('beacon_id'))
        if not all__filter:
            raise NotFound
        else:
            return all__filter[0]


class ShopView(ModelViewSet):
    serializer_class = ShopSerializerPOST
    permission_classes = (IsAuthenticated,)

    @detail_route(methods=['post'])
    def create(self, request, pk=None):
        serializer = ShopSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(owner=request.user)
            return Response(status=status.HTTP_201_CREATED, data=serializer.data)
        else:
            return Response(serializer.errors,
                            status=status.HTTP_400_BAD_REQUEST)

    def get_queryset(self):
        return self.request.user.shops.all()

    def update(self, request, *args, **kwargs):
        request._data = request.data
        request._full_data = request.data
        return super(ShopView, self).update(request, *args, **kwargs)


class BeaconView(ModelViewSet):
    serializer_class = BeaconSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        return self.request.user.beacons.all()

    @detail_route(methods=['post'])
    def create(self, request):
        serializer = BeaconSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data)
        else:
            return Response(serializer.errors,
                            status=status.HTTP_400_BAD_REQUEST)


class CampaignAdView(ModelViewSet):
    # TODO: create proper perrmission for create ad
    permission_classes = (IsAuthenticated, IsAdOwner)

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
    permission_classes = (IsAdOwner,)

    def get_object(self):
        obj = get_object_or_404(Campaign, pk=self.kwargs.get('pk'))
        self.check_object_permissions(self.request, obj)
        return obj

    def perform_create(self, serializer):
        serializer.save(campaign=self.get_object())

    def get_queryset(self):
        return self.get_object().actions.all()


class BeaconRetrieve(ModelViewSet):
    serializer_class = AdSerializerList
    permission_classes = (IsAdOwner,)

    def get_queryset(self):
        return self.request.user.beacons

    def get_object(self):
        beacon = get_object_or_404(Beacon, pk=self.kwargs.get('pk'))
        return beacon.action.ad

    def get_serializer_class(self):
        return super(BeaconRetrieve, self).get_serializer_class()

    def create(self, request, *args, **kwargs):
        return super(BeaconRetrieve, self).create(request, *args, **kwargs)


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
    def get_serializer_class(self):
        if self.request.method == 'GET':
            return PromotionSerializerGet
        else:
            return PromotionSerializerGet

    def get_queryset(self):
        promotions_all = get_object_or_404(Campaign, pk=self.kwargs.get('pk')).awards.all()
        return promotions_all

    def get_object(self):
        return get_object_or_404(self.get_queryset(), pk=self.kwargs.get('award_pk'))


class AwardView(AwardCreateView):
    def get_serializer_class(self):
        if self.request.method == 'GET':
            return AwardSerializerGet
        else:
            return AwardSerializer

    def get_queryset(self):
        if self.request.method == 'POST':
            query_set = get_object_or_404(Campaign, pk=self.kwargs.get('pk'))
            return query_set
        else:
            return super(AwardView, self).get_queryset()

    def perform_create(self, serializer):
        serializer.save(campaign=self.get_object())


class ImageUpdater(ModelViewSet):
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
    serializer_class = AwardImageSerializer

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
            return super(ImageUpdater, self).create(request, *args, **kwargs)
