from django.contrib import admin
from .models import *
from django.db import models
from django.utils.html import format_html
from django.contrib.admin.widgets import AdminFileWidget
from django.utils.safestring import mark_safe
from django.contrib.auth.models import User
from django.contrib.auth.admin import UserAdmin as AuthUserAdmin
from mptt.admin import DraggableMPTTAdmin
from django.forms import CheckboxSelectMultiple
from mptt.models import TreeManyToManyField
from django import forms


class filterCategories(forms.ModelForm):
    class Meta:
        model = Product
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        super(filterCategories, self).__init__(*args, **kwargs)
        # self.fields['variations'].queryset = Variations.objects.filter(
        #     children=None)


class filterComments(forms.ModelForm):
    class Meta:
        model = Product
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        super(filterComments, self).__init__(*args, **kwargs)


class AdminImageWidget(AdminFileWidget):
    def render(self, name, value, attrs=None, renderer=None):
        output = []
        if value and getattr(value, "url", None):
            image_url = value.url
            file_name = str(value)
            output.append(u' <a href="%s" target="_blank"><img src="%s" alt="%s" width="100" height="100"  style="object-fit: cover;"/></a>' %
                          (image_url, image_url, file_name))
        output.append(super(AdminFileWidget, self).render(name, value, attrs))
        return mark_safe(u''.join(output))


class ProductDetailsInline(admin.TabularInline):
    model = ProductDetailsList
    fk_name = 'product'
    extra = 1


class VariantsInline(admin.TabularInline):
    model = Variant
    fk_name = 'product'
    extra = 1
    formfield_overrides = {models.ImageField: {'widget': AdminImageWidget}}


class PicturesInline(admin.TabularInline):
    model = Pictures
    fk_name = 'product'
    extra = 1
    formfield_overrides = {models.ImageField: {'widget': AdminImageWidget}}


class RelatedProductsInline(admin.TabularInline):
    model = RelatedProduct
    fk_name = 'parent'
    extra = 1



class ProductAdmin(admin.ModelAdmin):
    form = filterCategories
    formfield_overrides = {
        TreeManyToManyField: {'widget': CheckboxSelectMultiple},
    }
    inlines = [
        VariantsInline,
        PicturesInline,
        ProductDetailsInline,
        RelatedProductsInline
    ]


class CommentAdmin(DraggableMPTTAdmin):
    mptt_indent_field = "parent"
    list_display = ('tree_actions', 'indented_title')
    list_display_links = ('indented_title',)


class CategoryAdmin(DraggableMPTTAdmin):
    mptt_indent_field = "name"
    list_display = ('tree_actions', 'indented_title',
                    'related_products_count', 'related_products_cumulative_count')
    list_display_links = ('indented_title',)

    def get_queryset(self, request):
        qs = super().get_queryset(request)

        # Add cumulative product count
        qs = Category.objects.add_related_count(
            qs,
            Product,
            'category',
            'products_cumulative_count',
            cumulative=True)

        # Add non cumulative product count
        qs = Category.objects.add_related_count(qs,
                                                Product,
                                                'category',
                                                'products_count',
                                                cumulative=False)
        return qs

    def related_products_count(self, instance):
        return instance.products_count
    related_products_count.short_description = 'Related products (for this specific category)'

    def related_products_cumulative_count(self, instance):
        return instance.products_cumulative_count
    related_products_cumulative_count.short_description = 'Related products (in tree)'




class ShipmentsInline(admin.TabularInline):
    model = Shipment
    fk_name = 'order'
    extra = 0


class PaymentsInline(admin.TabularInline):
    model = Payment
    fk_name = 'order'
    extra = 0


class ShippingAddressInline(admin.TabularInline):
    model = ShippingAddress
    fk_name = 'order'
    extra = 0


class OrderItemsInline(admin.TabularInline):
    model = OrderItem
    fk_name = 'order'
    extra = 0
    formfield_overrides = {models.ImageField: {'widget': AdminImageWidget}}


class OrderAdmin(admin.ModelAdmin):
    inlines = [
        OrderItemsInline,
        ShippingAddressInline,
        PaymentsInline,
        ShipmentsInline
    ]


# class VariationsAdmin(DraggableMPTTAdmin):
#     mptt_indent_field = "name"
#     list_display = ('tree_actions', 'indented_title')
#     list_display_links = ('indented_title',)


admin.site.register(Product, ProductAdmin)
admin.site.register(Order, OrderAdmin)
admin.site.register(Category, CategoryAdmin)
admin.site.register(Brand)
admin.site.register(Packsize)
admin.site.register(Material)
admin.site.register(Shipment)
admin.site.register(OrderItem)
admin.site.register(SizeChart)
admin.site.register(Payment)
admin.site.register(Type)
admin.site.register(Comment, CommentAdmin)


class ExtraUserInfo(admin.StackedInline):
    model = ExtraUserInfo
    max_num = 1
    can_delete = False


class UserAdmin(AuthUserAdmin):
    inlines = [ExtraUserInfo]


# unregister old user admin
admin.site.unregister(User)
# register new user admin
admin.site.register(User, UserAdmin)

# class NewOutstandingTokenAdmin(OutstandingTokenAdmin):

#     def has_delete_permission(self, *args, **kwargs):
#         return True


# admin.site.unregister(blacklist_models.OutstandingToken)
# admin.site.register(blacklist_models.OutstandingToken, NewOutstandingTokenAdmin)
