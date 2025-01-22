from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from base.models import Product, Order, OrderItem, ShippingAddress, Variant
from base._serializers import order_serializers
from rest_framework import status
from datetime import datetime
from collections import OrderedDict
import json
from rest_framework import generics
from rest_framework.views import APIView
from pprint import pprint


class OrderItemView(generics.CreateAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = order_serializers.OrderCreateSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            instance = self.perform_create(serializer)
            order_serializer = order_serializers.OrderSerializer(instance)
            return Response(order_serializer.data, status=status.HTTP_201_CREATED)
        if(start := str(serializer.errors).find('ErrorNoStock')):

            end = str(serializer.errors).find('EndMessage')
            x = slice(start, end)
            message = str(serializer.errors)[x]
            return Response({'detail': message}, status=status.HTTP_400_BAD_REQUEST)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def perform_create(self, serializer):
        order = serializer.save()
        return order


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getMyOrders(request):
    user = request.user
    orders = user.order_set.all()
    serializer = order_serializers.BasicOrderInformationSerializer(
        orders, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getOrderById(request, pk):
    user = request.user

    try:
        order = Order.objects.get(_id=pk)

        if order.user == user:
            serializer = order_serializers.OrderSerializer(order, many=False)
            return Response(serializer.data)

        else:
            return Response({'detail': 'Not authorized to view this order'}, status=status.HTTP_401_UNAUTHORIZED)

    except:
        return Response({'detail': 'Order does not exist'}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def preWebHookOrderItemsPaymentUpdate(request, pk):
    user = request.user
    order = Order.objects.get(_id=pk)
    if(order.user != user):
        return Response("You are not authorized")
    items = order.orderItems.all()
    for item in items:
        if item.readyToShip:
            item.UNVERIFIED_PAID = True
            item.save()
    return Response('Order was paid')


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getPayments(request, pk):
    user = request.user

    try:
        order = Order.objects.get(_id=pk)

        if order.user == user:
            serializer = order_serializers.OrderSerializer(order, many=False)
            return Response(len(serializer.data['payments']))

        else:
            return Response({'detail': 'Not authorized to view this order'}, status=status.HTTP_401_UNAUTHORIZED)

    except:
        return Response({'detail': 'Order does not exist'}, status=status.HTTP_400_BAD_REQUEST)
