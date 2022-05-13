
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from payments.views import ProcessWebhookView
from django.views.generic import TemplateView
from django.urls import re_path


urlpatterns = [

    path('fns192837465/', admin.site.urls),
    path('api/info/', include('base.urls.info_urls')),
    path('api/categories/', include('base.urls.categories_urls')),
    path('api/brands/', include('base.urls.brand_urls')),
    path('api/products/', include('base.urls.product_urls')),
    path('api/users/', include('base.urls.user_urls')),
    path('api/orders/', include('base.urls.order_urls')),
    path('webhooks/paypal/', ProcessWebhookView.as_view()),
    path('djrichtextfield/', include('djrichtextfield.urls')),
    re_path('', TemplateView.as_view(template_name='index.html')),
] 


urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

