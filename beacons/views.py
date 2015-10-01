from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from rest_framework.authtoken.views import ObtainAuthToken

from beacons.permissions import IsCampaignOwner
from rest_framework import status
from rest_framework.decorators import detail_route
from rest_framework.exceptions import NotFound
from rest_framework.generics import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from beacons.models import Campaign
from beacons.serializers import BeaconSerializer, CampaignSerializer, ShopSerializer, AdSerializerCreate, \
    AdSerializerList, \
    UserSerializer


class CreateViewUser(ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def post_save(self, obj, created=False):
        token = Token.objects.create(user=obj)
        obj.key = token


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
    serializer_class = ShopSerializer
    permission_classes = (IsAuthenticated,)

    @detail_route(methods=['post'])
    def create(self, request, pk=None):
        serializer = ShopSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(owner=request.user)
            return Response({'status': 'Shop created!'})
        else:
            return Response(serializer.errors,
                            status=status.HTTP_400_BAD_REQUEST)

    def get_queryset(self):
        return self.request.user.shops.all()


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
    permission_classes = (IsAuthenticated,)

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
        serializer = AdSerializerCreate(data=request.data)
        if serializer.is_valid():
            serializer.save(campaign=self.get_object())
            return Response(serializer.data)
        else:
            return Response(serializer.errors,
                            status=status.HTTP_400_BAD_REQUEST)

            # TODO: change adds to ads

    def get_queryset(self):
        return self.get_object().ads.all()
