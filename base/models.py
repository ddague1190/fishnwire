from django.db import models
from django.contrib.auth.models import User
from django.db.models import Avg
from django.db.models.signals import post_save, pre_delete
from django.forms import ImageField
from django.utils.text import slugify
from django.dispatch import receiver
from base.utils.sendOrderEmail import sendOrderEmail
from dotenv import load_dotenv
from mptt.models import MPTTModel, TreeForeignKey, TreeManyToManyField
import datetime
from django.urls import reverse
import os
from djrichtextfield.models import RichTextField


if not os.environ.get("PRODUCTION"):
    load_dotenv()

DISCOUNT_TIERS = (
    ('regular', 'Regular'),
    ('preferred', 'Preferred'),
    ('platinum', 'Platinum')
)


class ExtraUserInfo(models.Model):

    user = models.OneToOneField(
        User, on_delete=models.CASCADE, related_name='extra')
    discountTier = models.CharField(
        max_length=10, choices=DISCOUNT_TIERS, default='regular')
    isAuthenticated = models.BooleanField(default=False)
    OTP = models.IntegerField(null=True, blank=True)
    OTP_createdAt = models.DateTimeField(
        auto_now_add=False, null=True, blank=True)
    taxExempt = models.BooleanField(default=False)
    avatarUrl = models.ImageField(blank=True, null=True)

    def __str__(self):
        return self.user.username


@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        ExtraUserInfo.objects.create(user=instance)


@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    instance.extra.save()


class MessagingSystem(MPTTModel):
    user = models.ForeignKey(
        ExtraUserInfo, on_delete=models.CASCADE, blank=True, null=True, related_name='messages')
    parent = TreeForeignKey('self', blank=True, null=True,
                            related_name='children', on_delete=models.CASCADE)
    comment = models.TextField(max_length=200, null=True, blank=True)
    createdAt = models.DateTimeField(auto_now_add=True)
    _id = models.AutoField(primary_key=True, editable=False)

    def __str__(self):
        if self.product:
            return self.user.user.username
        else:
            parent = self.parent
            i = 0
            while parent:
                i += 1
                tmp = parent
                parent = parent.parent
            return f'Reply {self._id} to {tmp.user.user.username} (level {i})'


class Category(MPTTModel):

    CATEGORY_TYPES = (
        ('root', 'Root'),
        ('featured', 'Featured'),
        ('product', 'Product'),
        ('brand', 'Brand'),
        ('collection', 'Collection')
    )

    parent = TreeForeignKey('self', blank=True, null=True,
                            related_name='children', on_delete=models.CASCADE)
    type = models.CharField(
        max_length=20, choices=CATEGORY_TYPES, default='root')
    name = models.CharField(max_length=200)
    slug = models.SlugField()
    description = models.TextField(max_length=255, blank=True, null=True)
    image = models.ImageField(blank=True, null=True)

    class MPTTMeta:
        order_insertion_by = ['name']

    def save(self, *args, **kwargs):
        slug = ''.join(self.name.lower().split(' '))
        self.slug = slug
        super(Category, self).save(*args, **kwargs)

    def __str__(self):
        full_path = [self.name]
        k = self.parent
        while k is not None:
            full_path.append(k.name)
            k = k.parent
        return ' / '.join(full_path[::-1])


class Brand(models.Model):
    name = models.CharField(max_length=200)
    description = models.CharField(max_length=200)
    slug = models.SlugField(blank=True, null=True)

    class Meta:
        ordering = ['-name']

    def __str__(self):
        return self.name


class SizeChart(models.Model):
    gap = models.FloatField(null=True, blank=True)
    length_inch = models.FloatField(null=True, blank=True)
    length_metric = models.FloatField(null=True, blank=True)

    def __str__(self):
        return f'{self.gap, self.length_inch, self.length_metric}'


class Product(models.Model):
    brand = models.ForeignKey(
        Brand, related_name='productsbybrand', on_delete=models.CASCADE)
    category = models.ForeignKey(
        Category, related_name='productsbycategory', on_delete=models.CASCADE)
    subcategory = models.ForeignKey(
        Category, related_name='productsbysubcategory', on_delete=models.CASCADE)
    name = models.CharField(max_length=200)
    slug = models.SlugField(blank=True, unique=True)
    description = RichTextField()
    rating = models.DecimalField(
        max_digits=7, decimal_places=2, null=True, blank=True)
    pulltest = models.IntegerField(null=True, blank=True, default=0)
    numVariants = models.IntegerField(null=True, blank=True, default=0)
    createdAt = models.DateTimeField(auto_now_add=True)
    price = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    _id = models.AutoField(primary_key=True, editable=False)
    price = models.DecimalField(
        max_digits=7, decimal_places=2, null=True, blank=True)
    discountPrice = models.DecimalField(
        max_digits=7, decimal_places=2, null=True, blank=True)
    leadTime = models.IntegerField(null=True, blank=True)
    specImage = models.ImageField(null=True, blank=True)
    specWidth = models.IntegerField(null=True, blank=True)
    specHeight = models.IntegerField(null=True, blank=True)

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        self.createdAt = datetime.datetime.now()
        self.numVariants = self.variants.all().count()
        slug = ''.join(self.name.lower().split(' '))
        self.slug = slug
        super(Product, self).save(*args, **kwargs)

    def copy(self):
        tmp = Product.objects.create()
        tmp.brand = Brand.objects.get(pk=self.brand)
        tmp.category = Category.objects.get(pk=self.category)
        tmp.subcategory = Category.objects.get(pk=self.subcategory)
        tmp.name = str(datetime.datetime.now())
        tmp.description = self.description
        tmp.pulltest = self.pulltest
        tmp.price = self.price
        tmp.discountPrice = self.discountPrice
        tmp.leadTime = self.leadTime
        tmp.specImage = self.specImage
        tmp.specHeight = self.specHeight
        tmp.save()


class RelatedProduct(models.Model):
    parent = models.ForeignKey(
        Product, related_name='related_products', on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)


class Comment(MPTTModel):
    product = models.ForeignKey(
        Product, on_delete=models.CASCADE, blank=True, null=True, related_name='comments')
    parent = TreeForeignKey('self', blank=True, null=True,
                            related_name='children', on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    text = models.TextField(max_length=400, null=True, blank=True)
    createdAt = models.DateTimeField(auto_now_add=True)
    comId = models.IntegerField(primary_key=True, editable=False)
    # def __str__(self):
    #     if self.product:
    #         return self.product.name
    #     else:
    #         parent = self.parent
    #         i = 0
    #         while parent:
    #             i += 1
    #             tmp = parent
    #             parent = parent.parent
    #         return f'Reply {self._id} to {tmp.product.name} (level {i})'


class ProductDetailsList(models.Model):
    image= models.ImageField(null=True, blank=True)
    detail = models.CharField(max_length=200)
    product = models.ForeignKey(
        Product, on_delete=models.CASCADE, related_name='details')


class Pictures(models.Model):
    image = models.ImageField(null=True, blank=True)
    product = models.ForeignKey(
        Product, on_delete=models.CASCADE, related_name='images')


class Type(models.Model):
    name = models.CharField(max_length=100)
    code = models.CharField(max_length=10, blank=True, null=True)
    description = models.TextField(max_length=255, blank=True, null=True)

    class Meta:
        ordering = ['-name']

    def __str__(self):
        return self.name


class Packsize(models.Model):
    name = models.CharField(max_length=20)
    code = models.CharField(max_length=10, blank=True, null=True)

    class Meta:
        ordering = ['-name']

    def __str__(self):
        return self.name


class Material(models.Model):
    name = models.CharField(max_length=20)
    code = models.CharField(max_length=10, blank=True, null=True)

    def __str__(self):
        return self.name


class Variant(models.Model):
    identifier = models.CharField(max_length=100, blank=True, null=True)
    title = models.CharField(max_length=100, blank=True, null=True)
    product = models.ForeignKey(
        Product, on_delete=models.CASCADE, related_name='variants')
    _id = models.AutoField(primary_key=True, editable=False, unique=True)
    image = models.ImageField(null=True, blank=True)
    _type = models.ForeignKey(
        Type, on_delete=models.CASCADE, blank=True, null=True)
    pack = models.ForeignKey(
        Packsize, on_delete=models.CASCADE, blank=True, null=True)
    material = models.ForeignKey(
        Material, on_delete=models.CASCADE, blank=True, null=True)
    description = models.CharField(max_length=200, null=True, blank=True)
    price = models.DecimalField(
        max_digits=7, decimal_places=2, null=True, blank=True)
    discountPrice = models.DecimalField(
        max_digits=7, decimal_places=2, null=True, blank=True)
    countInStock = models.IntegerField(null=True, blank=True, default=0)
    sizechart = models.ForeignKey(
        SizeChart, on_delete=models.CASCADE, blank=True, null=True)

    def __str__(self):
        return str(self.description)

    def save(self, *args, **kwargs):
        super(Variant, self).save(*args, **kwargs)
        product = Product.objects.get(pk=self.product.pk)
        product.numVariants = product.variants.all().count()
        product.save()


class OrderManager(models.Manager):
    def create(self, **obj_data):
        return super(OrderManager, self).create(**obj_data)


class Order(models.Model):
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    createdAt = models.DateTimeField(auto_now_add=True)
    _id = models.AutoField(primary_key=True, editable=False)
    instructions = models.TextField(max_length=200, null=True, blank=True)
    objects = OrderManager()

    def __str__(self):
        return str(self._id)

    def save(self, *args, **kwargs):
        super(Order, self).save(*args, **kwargs)


class Shipment(models.Model):
    createdAt = models.DateTimeField(null=True, blank=True)
    order = models.ForeignKey(
        Order, on_delete=models.CASCADE, related_name='shipments')
    shippingService = models.CharField(
        max_length=200, null=True, blank=True, default='UPS')
    trackingNumber = models.CharField(max_length=200, null=True, blank=True)
    isDelivered = models.BooleanField(default=False)


class Payment(models.Model):
    createdAt = models.DateTimeField(null=True, blank=True)
    paymentMethod = models.CharField(max_length=200, null=True, blank=True)
    itemsPrice = models.DecimalField(
        max_digits=7, decimal_places=2, null=True, blank=True)
    taxPrice = models.DecimalField(
        max_digits=7, decimal_places=2, null=True, blank=True)
    shippingPrice = models.DecimalField(
        max_digits=7, decimal_places=2, null=True, blank=True, default=0)
    totalPrice = models.DecimalField(
        max_digits=7, decimal_places=2, null=True, blank=True)
    amountPaid = models.DecimalField(
        max_digits=7, decimal_places=2, null=True, blank=True)
    paymentID = models.CharField(max_length=200, null=True, blank=True)
    order = models.ForeignKey(
        Order, on_delete=models.CASCADE, related_name='payments', null=True,  blank=True)
    addressPayPal = models.TextField(max_length=200, null=True, blank=True)
    shipment = models.ForeignKey(
        Shipment, on_delete=models.SET_NULL, blank=True, null=True)


class OrderItem(models.Model):
    payment = models.ForeignKey(
        Payment, on_delete=models.SET_NULL, blank=True, null=True, related_name='paidItems')
    product = models.ForeignKey(
        Product, on_delete=models.CASCADE, blank=True, null=True)
    variant = models.ForeignKey(
        Variant, on_delete=models.CASCADE, blank=True, null=True)
    productId = models.IntegerField(null=True, blank=True)
    variantId = models.IntegerField(null=True, blank=True)
    order = models.ForeignKey(
        Order, on_delete=models.CASCADE, null=True, related_name='orderItems')
    qty = models.IntegerField(null=True, blank=True, default=0)
    subTotal = models.DecimalField(
        max_digits=7, decimal_places=2, null=True, blank=True)
    _id = models.AutoField(primary_key=True, editable=False)
    readyToShip = models.BooleanField(null=True, blank=True)
    UNVERIFIED_PAID = models.BooleanField(default=False)

    def save(self, *args, **kwargs):

        # 1. Import poduct
        self.product = Product.objects.get(_id=self.productId)

        # 2. Import variant attributes

        self.variant = Variant.objects.get(_id=self.variantId)
        # self.image = self.variant.image
        self.variantDescription = self.variant.description
        self.subTotal = int(self.variant.discountPrice) * int(self.qty)

        # 4. Drawdown
        self.readyToShip = True if self.variant.countInStock > self.qty else False
        self.variant.countInStock -= self.qty
        self.variant.save()
        super(OrderItem, self).save(*args, **kwargs)


@receiver(pre_delete, sender=OrderItem, dispatch_uid='return_to_stock')
def returnToStock(sender, instance, **kwargs):
    instance.variant.countInStock += instance.qty
    instance.variant.save()


class ShippingAddress(models.Model):
    order = models.OneToOneField(
        Order, on_delete=models.CASCADE, null=True, blank=True, related_name='shippingAddress')
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, blank=True, null=True)
    firstName = models.CharField(max_length=200, null=True, blank=True)
    lastName = models.CharField(max_length=200, null=True, blank=True)
    company = models.CharField(max_length=200, null=True, blank=True)
    streetAddress = models.CharField(max_length=200, null=True, blank=True)
    apartment = models.CharField(max_length=200, null=True, blank=True)
    city = models.CharField(max_length=200, null=True, blank=True)
    postalCode = models.CharField(max_length=200, null=True, blank=True)
    state = models.CharField(max_length=200, null=True, blank=True)
    _id = models.AutoField(primary_key=True, editable=False),
    phone = models.CharField(max_length=200, null=True, blank=True)
    email = models.EmailField(null=True, blank=True)

    def __str__(self):
        return str(self.streetAddress)
