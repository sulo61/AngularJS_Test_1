from beacons.permissions import IsOwner
from rest_framework import status
from rest_framework.decorators import detail_route
from rest_framework.generics import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from beacons.models import Beacon, Campaign
from beacons.serializers import BeaconSerializer, CampaignSerializer


class BeaconView(ModelViewSet):
    serializer_class = BeaconSerializer
    queryset = Beacon.objects.all()


class CampaignView(ModelViewSet):
    serializer_class = CampaignSerializer
    permission_classes = (IsAuthenticated,)
    queryset = Campaign.objects

    @detail_route(methods=['post'])
    def create(self, request, pk=None):
        serializer = CampaignSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(owner=request.user)
            return Response({'status': 'Campaign created!'})
        else:
            return Response(serializer.errors,
                            status=status.HTTP_400_BAD_REQUEST)


class CampaignBeaconView(ModelViewSet):
    serializer_class = BeaconSerializer
    permission_classes = (IsAuthenticated, IsOwner)

    def get_object(self):
        obj = get_object_or_404(Campaign, pk=self.kwargs.get('pk'))
        self.check_object_permissions(self.request, obj)
        return obj

    @detail_route(methods=['post'])
    def create(self, request, pk=None):
        serializer = BeaconSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(campaign=self.get_object())
            return Response({'status': 'Beacon created and set!'})
        else:
            return Response(serializer.errors,
                            status=status.HTTP_400_BAD_REQUEST)

    def get_queryset(self):
        return self.get_object().beacons.all()
