from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from rest_framework import status
from django.utils import timezone
from .models import Donation
from .serializers import DonationSerializer


@api_view(['GET', 'POST'])
def donation_list(request):
    if request.method == 'GET':
        donations = Donation.objects.all().order_by('-date')
        serializer = DonationSerializer(donations, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = DonationSerializer(data=request.data)
        if serializer.is_valid():
            instance = serializer.save()
            if request.user.is_authenticated and request.user.is_staff:
                instance.approval_status = 'approved'
                instance.created_by_admin = True
                instance.save()
            return Response(DonationSerializer(instance).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
def donation_detail(request, pk):
    try:
        donation = Donation.objects.get(pk=pk)
    except Donation.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = DonationSerializer(donation)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = DonationSerializer(donation, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        donation.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['PATCH'])
@permission_classes([IsAdminUser])
def donation_review(request, pk):
    try:
        donation = Donation.objects.get(pk=pk)
    except Donation.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    action = request.data.get('action')
    if action not in ['approve', 'reject']:
        return Response({'error': 'action must be approve or reject'}, status=status.HTTP_400_BAD_REQUEST)

    donation.approval_status = 'approved' if action == 'approve' else 'rejected'
    donation.admin_notes = request.data.get('admin_notes', '')
    donation.reviewed_at = timezone.now()
    donation.save()

    serializer = DonationSerializer(donation)
    return Response(serializer.data)