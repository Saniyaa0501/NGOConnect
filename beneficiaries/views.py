from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from rest_framework import status
from django.utils import timezone
from .models import Beneficiary
from .serializers import BeneficiarySerializer


@api_view(['GET', 'POST'])
def beneficiary_list(request):
    if request.method == 'GET':
        beneficiaries = Beneficiary.objects.all().order_by('-priority_score')
        serializer = BeneficiarySerializer(beneficiaries, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = BeneficiarySerializer(data=request.data)
        if serializer.is_valid():
            instance = serializer.save()
            if request.user.is_authenticated and request.user.is_staff:
                instance.approval_status = 'approved'
                instance.created_by_admin = True
                instance.save()
            return Response(BeneficiarySerializer(instance).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
def beneficiary_detail(request, pk):
    try:
        beneficiary = Beneficiary.objects.get(pk=pk)
    except Beneficiary.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = BeneficiarySerializer(beneficiary)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = BeneficiarySerializer(beneficiary, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        beneficiary.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['PATCH'])
@permission_classes([IsAdminUser])
def beneficiary_review(request, pk):
    try:
        beneficiary = Beneficiary.objects.get(pk=pk)
    except Beneficiary.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    action = request.data.get('action')
    if action not in ['approve', 'reject']:
        return Response({'error': 'action must be approve or reject'}, status=status.HTTP_400_BAD_REQUEST)

    beneficiary.approval_status = 'approved' if action == 'approve' else 'rejected'
    beneficiary.admin_notes = request.data.get('admin_notes', '')
    beneficiary.reviewed_at = timezone.now()
    beneficiary.save()

    serializer = BeneficiarySerializer(beneficiary)
    return Response(serializer.data)