from asyncore import read
from json.encoder import INFINITY
from rest_framework import serializers
from django.contrib.auth.models import User
from base.models import Product, Order, OrderItem, ShippingAddress, Comment, Variant, Pictures, Category, ProductDetailsList, SizeChart
from rest_framework.response import Response
from pprint import pprint


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = (
            "name",
            "slug",
            "description",
            "image",
            "type"
        )


class SizeChartSerializer(serializers.ModelSerializer):
    class Meta:
        model = SizeChart
        fields = '__all__'


class VariantSerializer(serializers.ModelSerializer):
    pack = serializers.SerializerMethodField(read_only=True)
    material = serializers.SerializerMethodField(read_only=True)
    _type = serializers.SerializerMethodField(read_only=True)
    sizechart = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Variant
        fields = '__all__'

    def get_pack(self, obj):
        try:
            val = obj.pack.name
        except:
            val = None
        return val

    def get_material(self, obj):
        try:
            val = obj.material.name
        except:
            val = None
        return val

    def get__type(self, obj):
        try:
            val = obj._type.name
        except:
            val = None
        return val

    def get_sizechart(self, obj):
        serializer = SizeChartSerializer(obj.sizechart, many=False)
        return serializer.data

class CreateCommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = '__all__'

    def validate(self, data):
        print(data)
        return data
    
    # def to_internal_value(self, data):
  
    #     return super().to_internal_value(data)

    # def validate_userId(self,value):
    #     print(value)
    #     return value
    # def validate_user(self, value):
    #     print(value, 'validate_user')
    #     return value
    

    # def validate_parentId(self, value):
    #     print(value, 'validate_parentId')
    #     return value
    
    # def create(self, validated_data):
    #     # if self.context['request'].user != validated_data['userId']:
    #     #     raise serializers.ValidationError(
    #     #         "Not authorized to post on behalf on another user")

    #     print(validated_data,'validateddata')
    #     return super().create(validated_data)
    

class CommentSerializer(serializers.ModelSerializer):
    avatarUrl = serializers.SerializerMethodField(read_only=True)
    replies = serializers.SerializerMethodField(read_only=True)
    userId = serializers.SerializerMethodField(read_only=True)
    fullName = serializers.SerializerMethodField(read_only=True)
    createdAt = serializers.SerializerMethodField(read_only=True)
    
    class Meta:
        model = Comment
        fields = ('userId', 'text', 'comId', 'replies', 'avatarUrl', 'fullName', 'createdAt')

    def get_fullName(self, obj):
        return obj.user.username

    def get_createdAt(self, obj):
        time = obj.createdAt
        return time.strftime("%m-%d-%Y (%H:%M)")

    def get_replies(self, obj):
        qs = obj.children.all()
        serializer = CommentSerializer(qs, many=True)
        return serializer.data

    def get_userId(self, obj):
        return obj.user.id

    def get_avatarUrl(self, obj):
        try:
            if obj.user.extra.avatarUrl:
                res = obj.user.extra.avatarUrl
                return f'https://fishnwirepictures.s3.amazonaws.com/{str(res)}'
        except:
            return None

class PicturesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pictures
        fields = '__all__'


class ProductDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductDetailsList
        fields ='__all__'


class ProductSerializer(serializers.ModelSerializer):
    comments = serializers.SerializerMethodField(read_only=True)
    variants = serializers.SerializerMethodField(read_only=True)
    images = serializers.SerializerMethodField(read_only=True)
    category = serializers.SerializerMethodField(read_only=True)
    subcategory = serializers.SerializerMethodField(read_only=True)
    details = serializers.SerializerMethodField(read_only=True)
    complete_size_chart = serializers.SerializerMethodField(read_only=True)
    specWidth = serializers.SerializerMethodField(read_only=True)
    related_products = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Product
        fields = '__all__'

    def get_related_products(self, obj):
        qs = obj.related_products.all()
        data = []
        for q in qs:
            serializer = BasicProductInfoSerializer(q.product, many=False)
            data.append(serializer.data)
        return data

    def get_specWidth(self, obj):
        if not obj.specImage:
            return 'no_spec'
        return obj.specWidth

    def get_complete_size_chart(self, obj):
        output = []
        touched = set()
        if obj.category.slug == 'hooks':
            for variant in obj.variants.all():
                type = variant._type.name
                if type not in touched:
                    dict = {'size': type}
                    serializer = SizeChartSerializer(
                        variant.sizechart, many=False)
                    dict.update(serializer.data)
                    output.append(dict)
                    touched.add(variant._type.name)
        return output

    def get_subcategory(self, obj):
        return {'name': obj.subcategory.name, 'slug': obj.subcategory.slug}

    def get_category(self, obj):
        return {'name': obj.category.name, 'slug': obj.category.slug}

    def get_comments(self, obj):
        qs = obj.comments.all().filter(parent=None)
        serializer = CommentSerializer(qs, many=True)
        return serializer.data

    def get_variants(self, obj):
        qs = obj.variants.all()
        serializer = VariantSerializer(qs, many=True)
        return serializer.data

    def get_details(self, obj):
        qs = obj.details.all()
        serializer = ProductDetailsSerializer(qs, many=True)
        return serializer.data

    def get_images(self, obj):
        qs = obj.images.all()
        serializer = PicturesSerializer(qs, many=True)
        return serializer.data


class BasicProductInfoSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField(read_only=True)
    variantFacts = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Product
        fields = ('name', 'slug', 'image', 'variantFacts')

    def get_variantFacts(self, obj):
        numVariants = obj.variants.all().count()
        try:
            bottomPrice = INFINITY
            for item in obj.variants.all():
                bottomPrice = min(item.price, bottomPrice)
        except:
            bottomPrice = ''
        return {'numVariants': numVariants, 'bottomPrice': bottomPrice}

    def get_image(self, obj):
        qs = obj.images.first()
        serializer = PicturesSerializer(qs)
        return serializer.data
