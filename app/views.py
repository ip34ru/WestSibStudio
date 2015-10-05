from django.shortcuts import HttpResponse
from django.views.generic import View
import json
from .models import *


class Brands_View(View):
    def get(self, request, *args, **kwargs):
        brands = Brand.objects.all()
        result = [{'id': brand.id,
                   'name': brand.name,
                   'text': brand.text,
                   'slug': brand.slug,
                   'tagline': brand.tagline,
                   'logo': {
                       'main': brand.logo.get_original_url()
                       if brand.logo else '',
                       'thumb': brand.logo.get_thumbnail_url()
                       if brand.logo else '',
                   },
                   'products': [{'id': product.id,
                                 'name': product.name,
                                 'text': product.text,
                                 'slug': product.slug,
                                 'main_image': product.main_image.image.url
                                 if product.main_image else '',
                                 'gallery': [
                                 {'original': photo.image.url,
                                  'thumb': photo.get_thumbnail_url()
                                  }for photo in product.gallery.all()],
                                 'price': str(product.price)
                                 } for product in brand.products.all()]
                   } for brand in brands]
        return HttpResponse(json.dumps(result, indent=1),
                            content_type='application/json')


class News_View(View):

    def get(self, request, *args, **kwargs):
        result = [{'id': news.id,
                   'title': news.title,
                   'teaser': news.teaser,
                   'text': news.text,
                   'date': str(news.date)} for news in News.objects.all()]
        return HttpResponse(json.dumps(result, indent=1),
                            content_type='application/json')


class Logo_View(View):

    def get(self, request, *args, **kwargs):
        logo = Logo.objects.all().first()
        if not logo:
            result = {'main_image': '', 'scroll_image': ''}
        else:
            result = {'main_image': logo.main_image.url,
                      'scroll_image': logo.scroll_image.url}
        return HttpResponse(json.dumps(result, indent=1),
                            content_type='application/json')


class Notes_View(View):

    def get(self, request, *args, **kwargs):
        note = Notes.objects.all().first()
        result = {'title_text': '', 'h_text': '', 'footer': ''}
        if note:
            result = {'title_text': note.title_text,
                      'h_text': note.h_text,
                      'footer': note.footer}
        return HttpResponse(json.dumps(result, indent=1),
                            content_type='application/json')
