from django.urls import path
from base.views import order_views as views


urlpatterns = [
    path('add/', views.OrderItemView.as_view(), name='orders-add'),
    path('myorders/', views.getMyOrders, name='myorders'),
    path('<str:pk>/', views.getOrderById, name='user-order'),
    path('<str:pk>/pay/', views.preWebHookOrderItemsPaymentUpdate, name='pay'),
    path('<str:pk>/payments/', views.getPayments, name='payments')

] 