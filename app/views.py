from django.shortcuts import HttpResponse, RequestContext
from django.views.generic import View
import json
from .models import *


class Brands(View):
    def get(self, request, *args, **kwargs):
        brands = Brand.objects.all()
        result = [{'name': brand.name,
                   'text': brand.text,
                   'tagline': brand.tagline,
                   'products': [{'name': product.name,
                                 'text': product.text,
                                 'image': product.image.url,
                                 'price': product.price} for product in brand.products.all()]} for brand in brands]
        return HttpResponse(json.dumps(result),RequestContext(request), content_type='applications/json')
