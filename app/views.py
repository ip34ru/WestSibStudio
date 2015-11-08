from django.shortcuts import HttpResponse, render_to_response, RequestContext
from django.views.generic import View, TemplateView
from paypal.standard.forms import PayPalPaymentsForm
from paypal.standard.models import ST_PP_COMPLETED
from paypal.standard.ipn.signals import valid_ipn_received
import json
from .models import *


def show_me_the_money(sender, **kwargs):
    ipn_obj = sender
    if ipn_obj.payment_status == ST_PP_COMPLETED:
        # Undertake some action depending upon `ipn_obj`.
        order = Order.objects.get(pk=ipn_obj.invoice.split(':')[0])
        order.status = 'paid'

valid_ipn_received.connect(show_me_the_money)


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


class Cart_View(View):
    ERRORS = {'no_products': 10,
              'no_product_id': 11,
              'no_product_count': 12,
              'no_user_data': 20,
              'no_user_name': 21,
              'no_user_phone': 22,
              'no_user_email': 23,
              'no_user_address': 24,
              'no_user_town': 25,
              'no_user_country': 26,
              'no_user_zip': 27, }

    def post(self, request, *args, **kwargs):
        errors = []
        normal = request.body.decode('utf8')
        print(normal)
        data = json.loads(normal)
        products = data.get('products', '')
        user_data = data.get('userData', '')
        if not products:
            errors.append(self.ERRORS['no_products'])
        if not user_data:
            errors.append(self.ERRORS['no_user_data'])
        if 'name' not in user_data:
            errors.append(self.ERRORS['no_user_name'])
        if 'phone' not in user_data:
            errors.append(self.ERRORS['no_user_phone'])
        if 'email' not in user_data:
            errors.append(self.ERRORS['no_user_email'])
        if 'address' not in user_data:
            errors.append(self.ERRORS['no_user_address'])
        if 'town' not in user_data:
            errors.append(self.ERRORS['no_user_town'])
        if 'country' not in user_data:
            errors.append(self.ERRORS['no_user_country'])
        if 'zipcode' not in user_data:
            errors.append(self.ERRORS['no_user_zip'])
        print(request.POST)

        if len(errors) > 0:
            return HttpResponse(json.dumps({'errors': errors}),
                                content_type="application/json")

        client = Client()
        client.name = user_data['name']
        client.phone = user_data['phone']
        client.company = user_data['company']
        client.email = user_data['email']
        client.address = user_data['address']
        client.town = user_data['town']
        client.country = user_data['country']
        client.zip = user_data['zipcode']
        client.save()
        order = Order()
        order.client = client
        order.save()
        for product in products:
            prod = Product.objects.get(pk=product['equipmentID'])
            item = OrderItem()
            item.product = prod
            item.count = product['equipmentAmount']
            item.save()
            order.sum += float(prod.price_discont if prod.is_discont else prod.price) * float(item.count)
            order.items.add(item)
        order.save()
        
        form = PayPalPaymentsForm(initial=order.get_paypal_dict())

        return render_to_response("payform.html", {"form": form}, RequestContext(request))

