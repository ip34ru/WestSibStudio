from django.contrib.admin import site
from .models import *

site.register(Brand)
site.register(Client)
site.register(Order)
site.register(Product)
