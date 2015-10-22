from django.shortcuts import HttpResponse
from django.views.generic import View, TemplateView
import json
from .models import *


class Home(TemplateView):
  template_name = 'main.html'
 
    
class Brands_View(View):

    def get(self, request, *args, **kwargs):
        brands = Brand.objects.all()
        result = [{'id': brand.id,
                   'name': brand.name,
                   'text': brand.text.replace('\r\n', '').replace('\t', ''),
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
                                 'text': product.text.replace('\r\n', '').replace('\t', ''),
                                 'slug': product.slug,
                                 'main_image': {'original': product.main_image.get_original_url(),
                                                'thumb': product.main_image.get_thumbnail_url(),
                                                'text': product.main_image.text}
                                 if product.main_image else {},
                                 'miniature_image': {'original': product.miniature_image.get_original_url(),
                                                     'thumb': product.miniature_image.get_thumbnail_url(),
                                                     'text': product.miniature_image.text
                                                     } if product.miniature_image else {},
                                 'gallery': [
                                     {'original': photo.get_original_url(),
                                      'thumb': photo.get_thumbnail_url(),
                                      'text': photo.text
                                      }for photo in product.gallery.all()],
                                 'price': str(product.price),
                                 'price_discont': str(product.price_discont) if product.is_discont else "",
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
