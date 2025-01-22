from django.urls import path
from base.views import product_views as views


urlpatterns = [
    path('', views.getProducts, name='products'),
    path('<category>/', views.getProducts, name='products'),
    path('<category>/<subcategory>/', views.getProducts, name='products'),
    path('<str:slug>/comments', views.CommentView.as_view(), name='addcomment'),
    path('<str:slug>', views.getProduct, name='product'),
]
