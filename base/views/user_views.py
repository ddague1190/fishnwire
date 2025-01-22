from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from rest_framework.response import Response
from base.models import Product, ExtraUserInfo, ShippingAddress
from django.contrib.auth.models import User
from base._serializers import product_serializers, user_serializers, order_serializers
from django.contrib.auth.hashers import make_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer, TokenRefreshSerializer
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework import status
from rest_framework import generics
from rest_framework_simplejwt.tokens import RefreshToken
from django.utils.decorators import method_decorator
from ratelimit.decorators import ratelimit
from base.utils.sendEmail import sendOTP
from datetime import datetime
from pprint import pprint
from django.core import serializers


class WithOTPTokenObtainPairView(TokenObtainPairView):
    serializer_class = user_serializers.OTPTokenObtainSerializer

    def get_user_and_delete(self, request):
        serializerForRemoval = TokenObtainPairSerializer(data=request.data)
        if serializerForRemoval.is_valid():
            serializerForRemoval.user.delete()

    @method_decorator(ratelimit(key='post:username', rate='5/h', method='POST'))
    def post(self, request, *args, **kwargs):

        was_limited = getattr(request, 'limited', False)
        if was_limited:
            # self.get_user_and_delete(request)
            return Response({'detail': 'Too many attempts. 1 hour timeout or try the login page.'}, status=status.HTTP_400_BAD_REQUEST)

        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            return Response(serializer.validated_data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = user_serializers.MyTokenObtainSerializer

    # @method_decorator(ratelimit(key='post:username', rate='10/h', method='POST'))
    def post(self, request, *args, **kwargs):
        was_limited = getattr(request, 'limited', False)
        if was_limited:
            return Response({'detail': 'Too many attempts, locked out for 1 hour. Contact store if you forgot password'}, status=status.HTTP_400_BAD_REQUEST)

        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            return Response(serializer.validated_data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class MyTokenRefreshView(TokenRefreshView):
    serializer_class = TokenRefreshSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            return Response(serializer.validated_data, status=status.HTTP_200_OK)

        return Response({'detail': 'Login required. Please logout.'}, status=status.HTTP_401_UNAUTHORIZED)


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = user_serializers.RegisterSerializer

    @method_decorator(ratelimit(key='ip', rate='20/h', method='POST'))
    def post(self, request, *args, **kwargs):
        was_limited = getattr(request, 'limited', False)
        if was_limited:
            return Response({'detail': 'Too many attempts, please wait or contact store'}, status=status.HTTP_400_BAD_REQUEST)
        return self.create(request, *args, **kwargs)

    def get_tokens_for_user(self, user):
        refresh = RefreshToken.for_user(user)

        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            # 'username': user.username
        }

    def email_validation(self, user):
        OTP = sendOTP(user.email)
        user.extra.OTP = OTP
        user.save()

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            instance = self.perform_create(serializer)
            credentials = self.get_tokens_for_user(instance)
            try:
                self.email_validation(instance)
            except e.message:
                return Response({'detail': f'{e.message} Please try again'}, status=status.HTTP_400_BAD_REQUEST)
            except:
                return Response({'detail': 'Problem with email validation protocol'}, status=status.HTTP_400_BAD_REQUEST)
            return Response(status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def perform_create(self, serializer):
        user = serializer.save()
        return user


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getUserProfile(request):
    user = request.user
    serializer = user_serializers.UserSerializer(user, many=False)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getShippingAddress(request):
    user = request.user
    qs = ShippingAddress.objects.filter(user=user).distinct('streetAddress')
    if len(qs) == 0:
        return Response({'detail': 'No addresses on file'}, status=status.HTTP_400_BAD_REQUEST)
    data = serializers.serialize('json', qs, fields=(
        'firstName', 'lastName', 'streetAddress', 'apartment', 'city', 'postalCode', 'state', 'phone'))
    return Response(data)


class ChangePasswordView(generics.UpdateAPIView):
    queryset = User.objects.all()
    permission_classes = (IsAuthenticated,)
    serializer_class = user_serializers.ChangePasswordSerializer

    def get_tokens_for_user(self, user):
        refresh = RefreshToken.for_user(user)

        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            # 'username': user.username
        }

    def get_object(self):
        return self.request.user

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(
            instance, data=request.data, partial=partial)
        if serializer.is_valid():
            self.perform_update(serializer)
            credentials = self.get_tokens_for_user(instance)
            return Response(credentials, status=status.HTTP_202_ACCEPTED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
