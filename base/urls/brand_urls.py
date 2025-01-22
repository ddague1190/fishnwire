from django.urls import path
from base.views import product_views as views

urlpatterns = [
    path('<brand>/', views.getProductsByBrand, name='brands')
]