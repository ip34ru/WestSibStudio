from django.shortcuts import HttpResponse
from django.views.generic import View
import json
from .models import *


class Brands(View):
    def get(self, request, *args, **kwargs):
        brands = Brand.objects.all()
        result = [{'id': brand.id,
                   'name': brand.name,
                   'text': brand.text,
                   'slug': brand.slug,
                   'tagline': brand.tagline,
                   'logo': {
                       'main': brand.logo.image.url if brand.logo else '',
                       'thumb': brand.logo.image.get_thumbnail_url() if brand.logo else '',
                   },
                   'products': [{'id': product.id,
                                 'name': product.name,
                                 'text': product.text,
                                 'slug': product.slug,
                                 'main_image': product.main_image.image.url,
                                 'gallery': [{'original': photo.image.url, 'thumb': photo.get_thumbnail_url()} for photo
                                             in product.gallery.all()],
                                 'price': str(product.price)} for product in brand.products.all()]} for brand in brands]
        return HttpResponse(json.dumps(result, indent=1), content_type='application/json')
