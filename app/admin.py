from django.contrib.admin import site
from .models import *

site.register(Brand)
site.register(Client)
site.register(Order)
site.register(Product)
site.register(Photo)
site.register(Logo)
site.register(Notes)
site.register(OrderItem)
site.register(News)
