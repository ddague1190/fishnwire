from http.client import REQUEST_TIMEOUT
from django.shortcuts import render
from django.http import JsonResponse, QueryDict
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from base.models import Product, Comment, OrderItem, Category
from rest_framework import status
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from rest_framework import generics
from django.contrib.auth.models import User
from base._serializers import product_serializers
from rest_framework import serializers
from pprint import pprint
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt



class CategoryTreeView(generics.GenericAPIView):
    serializer_class = product_serializers.CategorySerializer

    def get(self, request, *args, **kwargs):

        root_nodes = Category.objects.all().get_cached_trees()

        data = []
        for n in root_nodes:
            data.append(self.recursive_node_to_dict(n))

        return Response(data)

    def recursive_node_to_dict(self, node):
        result = self.get_serializer(instance=node).data
        children = [self.recursive_node_to_dict(
            c) for c in node.get_children()]
        if children:
            result["children"] = children
        return result


@api_view(['GET'])
def getProducts(request, category='', subcategory=''):
    query = request.query_params.get('keyword')
    if query == None:
        query = ''
    products = Product.objects.filter(name__icontains=query)
    if category:
        category_object = Category.objects.filter(slug=category).first()
        products = Product.objects.filter(
            category=category_object)
        temp = products
        if category == 'all':
            products = Product.objects.all().order_by('-createdAt')

    if subcategory:
        subcategory_object = Category.objects.filter(slug=subcategory).first()
        products = Product.objects.filter(
            subcategory=subcategory_object)
        if subcategory == 'all'+category or subcategory == 'all':
            products = temp
        if subcategory == 'closeout':
            products = temp.filter(subcategory__slug=subcategory)

    page = request.query_params.get('page')
    paginator = Paginator(products, 10)

    try:
        products = paginator.page(page)
    except PageNotAnInteger:
        products = paginator.page(1)
    except EmptyPage:
        products = paginator.page(paginator.num_pages)

    if page == None:
        page = 1

    page = int(page)

    serializer = product_serializers.BasicProductInfoSerializer(
        products, many=True)
    return Response({
        'products': serializer.data,
        'page': page,
        'pages': paginator.num_pages,
    })


@api_view(['GET'])
def getProductsByBrand(request, brand=''):
    products = Product.objects.filter(brand__slug=brand)
    page = request.query_params.get('page')
    paginator = Paginator(products, 10)

    try:
        products = paginator.page(page)
    except PageNotAnInteger:
        products = paginator.page(1)
    except EmptyPage:
        products = paginator.page(paginator.num_pages)

    if page == None:
        page = 1

    page = int(page)

    serializer = product_serializers.BasicProductInfoSerializer(
        products, many=True)
    return Response({
        'products': serializer.data,
        'page': page,
        'pages': paginator.num_pages
    })


@api_view(['GET'])
def getProduct(request, slug):
    product = Product.objects.get(slug=slug)
    serializer = product_serializers.ProductSerializer(product, many=False)
    return Response(serializer.data)


class CommentView(generics.CreateAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = product_serializers.CreateCommentSerializer

    def validateUUID(self,uuid):
        try:
            int(''.join((uuid.split('-'))),16)
        except:
            raise serializers.ValidationError({'detail': "Not authorized"})
        return 

    def create(self, request, slug, *args, **kwargs):
        user = request.user
        product = Product.objects.get(slug=slug)
        try:
            comId = int(request.data['comId'])
        except:
            return Response({'detail': 'Invalid comment identifier'}, status=status.HTTP_401_UNAUTHORIZED)
        serializer = self.get_serializer(data=request.data)
        if type(serializer) != product_serializers.CreateCommentSerializer:
            return Response({'detail': 'Not authorized for this post'}, status=status.HTTP_401_UNAUTHORIZED)
        if not serializer.is_valid():
            return Response({'detail': 'Not authorized for this post'}, status=status.HTTP_401_UNAUTHORIZED)

        serializer.save(user=request.user,
                        product=Product.objects.get(slug=slug), comId=comId)

        return Response(status=status.HTTP_201_CREATED)

class EditCommentView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Comment.objects.all()
    permission_classes = (IsAuthenticated,)
    serializer_class = product_serializers.CreateCommentSerializer
    lookup_field = 'comId'
    lookup_url_kwarg = 'comId'

    def get_object(self):
        postAuthor = Comment.objects.get(pk=self.kwargs['comId']).user
        if postAuthor != self.request.user:
            raise serializers.ValidationError({'detail': "Not authorized"})
        return super().get_object()


