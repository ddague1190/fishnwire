from itertools import product
import datetime
from rest_framework import serializers
from django.contrib.auth.models import User
from base.models import Product, Order, OrderItem, ShippingAddress, Variant, Shipment, Payment
from rest_framework.response import Response
from collections import OrderedDict
from django.db.models.fields import PositiveIntegerField
from django.db.models import Sum
from base._serializers import user_serializers
from base._serializers import product_serializers


class ShippingAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShippingAddress
        fields = '__all__'


class OrderItemSerializer(serializers.ModelSerializer):
    variantInfo = serializers.SerializerMethodField(read_only=True)
    productInfo = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = OrderItem
        fields = '__all__'

    def get_variantInfo(self, obj):
        variant = Variant.objects.get(_id=obj.variantId)
        serializer = product_serializers.VariantSerializer(variant)
        return serializer.data

    def get_productInfo(self, obj):
        product = Product.objects.get(_id=obj.productId)
        serializer = product_serializers.BasicProductInfoSerializer(product)
        return serializer.data


class ShipmentsSerializer(serializers.ModelSerializer):
    createdAt = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Shipment
        fields = '__all__'

    def get_createdAt(self, obj):
        time = obj.createdAt
        return time.strftime("%m-%d-%Y (%H:%M)")


class PaymentsSerializer(serializers.ModelSerializer):
    paidItems = serializers.SerializerMethodField(read_only=True)
    createdAt = serializers.SerializerMethodField(read_only=True)
    shipment = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Payment
        fields = '__all__'

    def get_paidItems(self, obj):
        items = obj.paidItems.all()
        serializer = OrderItemSerializer(items, many=True)
        return serializer.data

    def get_createdAt(self, obj):
        time = obj.createdAt
        return time.strftime("%m-%d-%Y (%H:%M)")

    def get_shipment(self, obj):
        if not obj.shipment:
            return False
        serializer = ShipmentsSerializer(obj.shipment, many=False)
        return serializer.data


class OrderSerializer(serializers.ModelSerializer):
    orderItems = serializers.SerializerMethodField(read_only=True)
    shippingAddress = serializers.SerializerMethodField(read_only=True)
    user = serializers.SerializerMethodField(read_only=True)
    payments = serializers.SerializerMethodField(read_only=True)
    createdAt = serializers.SerializerMethodField(read_only=True)
    totalPrice = serializers.SerializerMethodField(read_only=True)
    finalPrice = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Order
        fields = '__all__'

    def get_totalPrice(self, obj):
        items = obj.orderItems.all()
        totalPrice = 0
        for item in items:
            if item.readyToShip:
                totalPrice += item.subTotal
        return totalPrice

    def get_finalPrice(self, obj):
        items = obj.orderItems.all()
        finalPrice = 0
        for item in items:
            if item.readyToShip:
                finalPrice += item.subTotal
        temp = finalPrice
        finalPrice = round(float(finalPrice)*1.07, 2)
        finalPrice += 10 if temp <= 100 else 0
        return finalPrice

    def get_createdAt(self, obj):
        time = obj.createdAt
        return time.strftime("%m-%d-%Y (%H:%M)")

    def get_payments(self, obj):
        items = obj.payments.all()
        serializer = PaymentsSerializer(items, many=True)
        return serializer.data

    def get_orderItems(self, obj):
        items = obj.orderItems.all()
        serializer = OrderItemSerializer(items, many=True)
        return serializer.data

    def get_shippingAddress(self, obj):
        try:
            address = ShippingAddressSerializer(
                obj.shippingAddress, many=False).data
        except:
            address = False
        return address

    def get_user(self, obj):
        user = obj.user
        serializer = user_serializers.UserSerializer(user, many=False)
        return serializer.data


class OrderItemsCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ('productId', 'variantId', 'qty', )


class ShippingAddressCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShippingAddress
        fields = '__all__'


class OrderCreateSerializer(serializers.ModelSerializer):
    orderItems = OrderItemsCreateSerializer(many=True)
    shippingAddress = ShippingAddressCreateSerializer()

    class Meta:
        model = Order
        fields = ('orderItems', 'shippingAddress', 'instructions',)

    def create(self, validated_data):
        user = self.context['request'].user
        temp_orderItems = validated_data.pop('orderItems')
        temp_shippingAddress = validated_data.pop('shippingAddress')

        # Check length of order
        if len(temp_orderItems) == 0:
            raise serializers.ValidationError(
                "Orders must have at least one order item")
        new_order = Order.objects.create(user=user, **validated_data)

        # Create order items
        for temp_orderItem in temp_orderItems:
            new_orderItem = OrderItem.objects.create(
                order=new_order, **temp_orderItem)

        new_order.save()

        # Create shipping address
        ShippingAddress.objects.create(
            order=new_order, user=user, **temp_shippingAddress)

        return new_order


class BasicOrderInformationSerializer(serializers.ModelSerializer):
    status = serializers.SerializerMethodField(read_only=True)
    readyAndNotReadyTotalPrice = serializers.SerializerMethodField(
        read_only=True)
    createdAt = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Order
        fields = ('_id', 'status', 'readyAndNotReadyTotalPrice', 'createdAt',)

    def get_createdAt(self, obj):
        time = obj.createdAt
        return time.strftime("%m-%d-%Y (%H:%M)")

    def get_readyAndNotReadyTotalPrice(self, obj):
        items = obj.orderItems.all()
        output = 0
        for item in items:
            output += item.subTotal
        return output

    def get_status(self, obj):
        items = obj.orderItems.all()
        dict = {'payNow': False,
                'gettingReady': 0,
                'shipped': 0,
                'delivered': 0,
                'waitingOnItem': 0,
                }
        for item in items:
            if not item.readyToShip:
                dict['waitingOnItem'] += 1
            if item.readyToShip and not item.UNVERIFIED_PAID:
                dict['payNow'] = True
            if item.payment:
                if not item.payment.shipment:
                    dict['gettingReady'] += 1
                if item.payment.shipment:
                    dict['shipped'] += 1
                    if item.payment.shipment.isDelivered:
                        dict['delivered'] += 1
        return dict
