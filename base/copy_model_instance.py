from django.forms.models import model_to_dict
from models import *

def copy_hook():
    slug = 'mustadbeakhook'
    object = Product.objects.get(slug=slug)
    print(object)

copy_hook()