from django.test import TestCase
from app.models import Brand, Product


class NewsViewTest(TestCase):
    def test_news_json(self):
        brand = Brand(name='fake-name',
                      slug='fake-slug',
                      tagline='fake-tagline',
                      text='fake-text',)
        brand.save()
        response = self.client.get('/ajax/brands/')
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'fake-name')
        self.assertContains(response, 'fake-slug')
        self.assertContains(response, 'fake-tagline')
        self.assertContains(response, 'fake-text')
        product = Product(name='fake-product-name',
                          slug='fake-product-slug',
                          text='fake-product-text',)
        product.save()
        brand.products.add(product)
        brand.save()
        response = self.client.get('/ajax/brands/')
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'fake-product-name')
