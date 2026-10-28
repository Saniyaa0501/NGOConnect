from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .models import CustomUser
from .serializers import RegisterSerializer, UserSerializer, UpdateProfileSerializer, ChangePasswordSerializer
from donations.models import Donation
from beneficiaries.models import Beneficiary


def set_auth_cookies(response, user):
    refresh = RefreshToken.for_user(user)
    access = str(refresh.access_token)
    response.set_cookie(key='access_token', value=access, httponly=True, secure=False, samesite='Lax', max_age=60 * 60)
    response.set_cookie(key='refresh_token', value=str(refresh), httponly=True, secure=False, samesite='Lax', max_age=60 * 60 * 24 * 7)
    return response


@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        response = Response({'user': UserSerializer(user).data}, status=status.HTTP_201_CREATED)
        return set_auth_cookies(response, user)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    email = request.data.get('email')
    password = request.data.get('password')
    try:
        user_obj = CustomUser.objects.get(email=email)
        user = authenticate(username=user_obj.username, password=password)
        if user:
            response = Response({'user': UserSerializer(user).data})
            return set_auth_cookies(response, user)
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
    except CustomUser.DoesNotExist:
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)


@api_view(['GET', 'PATCH'])
@permission_classes([IsAuthenticated])
def profile(request):
    if request.method == 'GET':
        return Response(UserSerializer(request.user).data)
    elif request.method == 'PATCH':
        serializer = UpdateProfileSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(UserSerializer(request.user).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def change_password(request):
    serializer = ChangePasswordSerializer(data=request.data, context={'request': request})
    if serializer.is_valid():
        serializer.save()
        return Response({'message': 'Password changed successfully'})
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def logout(request):
    response = Response({'message': 'Logged out successfully'})
    response.delete_cookie('access_token')
    response.delete_cookie('refresh_token')
    return response


@api_view(['GET'])
@permission_classes([AllowAny])
def public_stats(request):
    total_donations = Donation.objects.count()
    total_amount = sum(float(d.amount) for d in Donation.objects.all())
    total_beneficiaries = Beneficiary.objects.count()
    return Response({
        'total_donations': total_donations,
        'total_amount': total_amount,
        'total_beneficiaries': total_beneficiaries,
    })


@api_view(['POST'])
@permission_classes([AllowAny])
def forgot_password(request):
    email = request.data.get('email')
    new_password = request.data.get('new_password')
    if not email or not new_password:
        return Response({'error': 'Email and new password are required'}, status=status.HTTP_400_BAD_REQUEST)
    try:
        user = CustomUser.objects.get(email=email)
        user.set_password(new_password)
        user.save()
        return Response({'message': 'Password reset successful'})
    except CustomUser.DoesNotExist:
        return Response({'error': 'No account found with this email'}, status=status.HTTP_404_NOT_FOUND)