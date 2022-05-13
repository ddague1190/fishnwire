from rest_framework import serializers
from django.contrib.auth.models import User
from base.models import Product, Order, OrderItem, ShippingAddress, Comment, Variant
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response
from rest_framework.validators import UniqueValidator
from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer, TokenRefreshSerializer
from base.utils.sendEmail import sendOTP

class OTPTokenObtainSerializer(TokenObtainPairSerializer):

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        self.fields['OTP'] = serializers.IntegerField()

    def validate(self, attrs):
        data = super().validate(attrs)

        if self.user.extra.OTP == int(attrs['OTP']):
            self.user.extra.isAuthenticated = True
            self.user.save()
            return data

        raise serializers.ValidationError({'detail': 'You\'ve entered an incorrect OTP. We sent the correct code to your email. If you need new code, go to login page.'})

class MyTokenObtainSerializer(TokenObtainPairSerializer):
    def email_validation(self):
        OTP = sendOTP(self.user.email)
        self.user.extra.OTP = OTP
        self.user.save()

    def get_avatarURL(self):
        try:
            if self.user.extra.avatarUrl:
                res = self.user.extra.avatarUrl
                return f'https://fishnwirepictures.s3.amazonaws.com/{str(res)}'
        except:
            return None


    def validate(self, attrs):
        
        data = super().validate(attrs)
        data['avatarUrl'] = self.get_avatarURL()
        # refresh = self.get_token(self.user)
        if not self.user.extra.isAuthenticated:
            self.email_validation()
            raise serializers.ValidationError({'detail': 'We were not able to verify your email. We sent another OTP to your email, please enter it below...'})
        return data


class UserSerializer(serializers.ModelSerializer):
    avatarUrl = serializers.SerializerMethodField(read_only=True)
    class Meta:
        model = User
        fields = ('username', 'email', 'avatarUrl')
    
    def get_avatarUrl(self, obj):
        try:
            if obj.extra.avatarUrl:
                res = obj.extra.avatarUrl
                return f'https://fishnwirepictures.s3.amazonaws.com/{str(res)}'
        except:
            return None

class RegisterSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
            required=True,
            # validators=[UniqueValidator(queryset=User.objects.all(), message=("Account with that email already exists. Please contact us if you need help accessing account"))]
            )
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    

    class Meta:
        model = User
        fields = ('username', 'email', 'password')

    def validate_username(self, value):
        if len(value) < 4:
            raise serializers.ValidationError("Username must be more than 5 characters")
        return value

    def create(self, validated_data):
        user = User.objects.create(
            username=validated_data['username'],
            email=validated_data['email'],
        )
        user.set_password(validated_data.pop('password'))
        user.save()
        return user

class ChangePasswordSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)
    old_password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ('old_password', 'password', 'password2')

    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError("Password fields didn't match.")
        return data

    def validate_old_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError("Old password is not correct")
        return value

    def update(self, instance, validated_data):
        instance.set_password(validated_data['password'])
        instance.save()
        return instance

