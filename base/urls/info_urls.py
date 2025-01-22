from django.urls import path
from base.views import info_views as views

urlpatterns = [
    path('<str:id>/', views.getFishWatchAPI, name='info')
]

