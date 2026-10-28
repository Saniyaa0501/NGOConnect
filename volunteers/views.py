from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework import status
from django.utils import timezone
from .models import Volunteer
from .serializers import VolunteerSerializer


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def volunteer_list(request):
    if request.method == 'GET':
        volunteers = Volunteer.objects.all().order_by('-joined_on')
        serializer = VolunteerSerializer(volunteers, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = VolunteerSerializer(data=request.data)
        if serializer.is_valid():
            instance = serializer.save()
            if request.user.is_authenticated and request.user.is_staff:
                instance.approval_status = 'approved'
                instance.created_by_admin = True
                instance.save()
            return Response(VolunteerSerializer(instance).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def volunteer_detail(request, pk):
    try:
        volunteer = Volunteer.objects.get(pk=pk)
    except Volunteer.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = VolunteerSerializer(volunteer)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = VolunteerSerializer(volunteer, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        volunteer.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['PATCH'])
@permission_classes([IsAdminUser])
def volunteer_review(request, pk):
    try:
        volunteer = Volunteer.objects.get(pk=pk)
    except Volunteer.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    action = request.data.get('action')
    if action not in ['approve', 'reject']:
        return Response({'error': 'action must be approve or reject'}, status=status.HTTP_400_BAD_REQUEST)

    volunteer.approval_status = 'approved' if action == 'approve' else 'rejected'
    volunteer.admin_notes = request.data.get('admin_notes', '')
    volunteer.reviewed_at = timezone.now()
    volunteer.save()

    serializer = VolunteerSerializer(volunteer)
    return Response(serializer.data)