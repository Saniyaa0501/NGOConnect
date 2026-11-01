import re
from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from .models import CustomUser

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)
    confirm_password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = CustomUser
        fields = ('username', 'email', 'password', 'confirm_password', 'phone')

    def validate_email(self, value):
        if CustomUser.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError('This email is already registered')
        return value

    def validate_phone(self, value):
        if not re.fullmatch(r'\d{10}', value or ''):
            raise serializers.ValidationError('Phone number must be exactly 10 digits')
        return value

    def validate(self, attrs):
        pw = attrs['password']
        if pw != attrs['confirm_password']:
            raise serializers.ValidationError({'password': 'Passwords do not match'})
        if (len(pw) < 8 or not re.search(r'[A-Z]', pw) or not re.search(r'[a-z]', pw)
                or not re.search(r'\d', pw) or not re.search(r'[^A-Za-z0-9]', pw)):
            raise serializers.ValidationError({'password': 'Password must be 8+ characters with a capital letter, small letter, number and special character'})
        return attrs

    def create(self, validated_data):
        validated_data.pop('confirm_password')
        user = CustomUser.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            role='user',
            phone=validated_data.get('phone', ''),
        )
        return user

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('id', 'username', 'email', 'role', 'phone')


class UpdateProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('username', 'email', 'phone')


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(write_only=True, required=True)
    new_password = serializers.CharField(write_only=True, required=True)
    confirm_new_password = serializers.CharField(write_only=True, required=True)

    def validate_old_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError('Current password is incorrect')
        return value

    def validate(self, attrs):
        if attrs['new_password'] != attrs['confirm_new_password']:
            raise serializers.ValidationError({'new_password': 'Passwords do not match'})
        validate_password(attrs['new_password'])
        return attrs

    def save(self, **kwargs):
        user = self.context['request'].user
        user.set_password(self.validated_data['new_password'])
        user.save()
        return user