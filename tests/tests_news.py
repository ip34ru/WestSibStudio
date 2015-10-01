from django.test import TestCase
from datetime import datetime
from app.models import News


class NewsViewTest(TestCase):
    def test_news_json(self):
        now = datetime.now()
        news = News(title='fake-title',
                    teaser='fake-teaser',
                    text='fake-text',
                    date=now)
        news.save()
        response = self.client.get('/ajax/news/')
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'fake-title')
        self.assertContains(response, 'fake-teaser')
        self.assertContains(response, 'fake-text')
