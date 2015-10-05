# coding=utf-8
import os
from django.db import models
from ckeditor_uploader.fields import RichTextUploadingField
from PIL import Image

THUMBNAIL_SIZE = 128, 128


class Photo(models.Model):
    image = models.ImageField('Изображение', upload_to='images/')

    text = models.CharField(verbose_name=u'Текст', max_length=150, blank=True)

    class Meta:
        verbose_name = u'Изображение'
        verbose_name_plural = u'Изображения'

    def __unicode__(self):
        return self.text or 'img'

    def __str__(self):
        return self.__unicode__()

    def save(self, force_insert=False, force_update=False, using=None,
             update_fields=None):
        super(Photo, self).save(force_insert=False,
                                force_update=False,
                                using=None,
                                update_fields=None)
        img_path = self.image.path.replace('\\', '/')
        img_result_path = os.path.join(os.path.dirname(img_path),
                                       'thumbs',
                                       os.path.basename(img_path))
        img = Image.open(img_path)
        img.thumbnail(THUMBNAIL_SIZE)
        img.save(img_result_path)

    def get_original_url(self):
        return self.image.url

    def get_thumbnail_url(self):
        original = self.get_original_url()
        i = original.rfind('/')
        return original[:i] + '/thumbs' + original[i:]


class Logo(models.Model):
    main_image = models.ImageField(verbose_name='Главное изображение',
                                   upload_to='logos')
    scroll_image = models.ImageField(verbose_name='Изображение при скролле',
                                     upload_to='logos')

    class Meta:
        verbose_name = u'Логотип сайта'
        verbose_name_plural = u'Логотипы сайта'


class Notes(models.Model):
    title_text = models.CharField(verbose_name=u'Title', max_length=255,
                                  blank=True, null=True)
    h_text = models.CharField(verbose_name=u'Заголовок', max_length=255,
                              blank=True, null=True)
    footer = models.CharField(verbose_name=u'Текст подвала', max_length=255,
                              blank=True, null=True)

    class Meta:
        verbose_name = u'Описание'
        verbose_name_plural = u'Описания'

    def __unicode__(self):
        return self.title_text

    def __str__(self):
        return self.__unicode__()


class Client(models.Model):
    name = models.CharField(verbose_name=u'ФИО', max_length=150)
    phone = models.CharField(
        verbose_name=u'Телефон', max_length=50, blank=True)
    company = models.CharField(verbose_name=u'Компания', max_length=150)
    email = models.EmailField(verbose_name=u'E-mail')
    address = models.TextField(verbose_name=u'Адрес')
    town = models.CharField(verbose_name=u'Город', max_length=150)
    country = models.CharField(verbose_name=u'Страна', max_length=150)
    zip = models.CharField(verbose_name=u'Индекс', max_length=150)

    class Meta:
        verbose_name = u'Клиент'
        verbose_name_plural = u'Клиенты'

    def __unicode__(self):
        return self.name

    def __str__(self):
        return self.__unicode__()


class Product(models.Model):
    name = models.CharField(verbose_name=u'Название', max_length=150)
    slug = models.CharField(verbose_name=u'Слаг', max_length=150, blank=True)
    text = RichTextUploadingField(verbose_name=u'Описание')
    main_image = models.ForeignKey(Photo, verbose_name=u"Главное изображение",
                                   related_name="main_image", blank=True,
                                   null=True)

    gallery = models.ManyToManyField(Photo, verbose_name=u"Изображения",
                                     blank=True)

    price = models.DecimalField(verbose_name=u'Цена', max_digits=6, default=0.0,
                                decimal_places=2)

    class Meta:
        verbose_name = u'Продукт'
        verbose_name_plural = u'Продукты'

    def __unicode__(self):
        return self.name

    def __str__(self):
        return self.__unicode__()

    def get_admin_th(self):
        if self.main_image:
            return '<img src="%s" width="100"/>' % self.main_image.get_thumbnail_url()
        return '<strong>%s</strong>' % self.name
    get_admin_th.short_description = u'Фото'
    get_admin_th.allow_tags = True


class Brand(models.Model):
    name = models.CharField(verbose_name=u'Название', max_length=150)
    slug = models.CharField(verbose_name=u'Слаг', max_length=150, blank=True)
    logo = models.ForeignKey(Photo, verbose_name=u"Главное изображение",
                             related_name="main_photo", blank=True,
                             null=True)

    tagline = models.CharField(verbose_name=u'Слоган', max_length=150)
    text = RichTextUploadingField(verbose_name=u'Описание')

    products = models.ManyToManyField(Product, verbose_name=u'Продукты',
                                      blank=True)

    class Meta:
        verbose_name = u'Производитель'
        verbose_name_plural = u'Производители'

    def __unicode__(self):
        return self.name

    def __str__(self):
        return self.__unicode__()

    def get_admin_th(self):
        if self.logo:
            return '<img src="%s" width="100"/>' % self.logo.get_thumbnail_url()
        return '<strong>%s</strong>' % self.name
    get_admin_th.short_description = u'Фото'
    get_admin_th.allow_tags = True


class OrderItem(models.Model):
    product = models.ForeignKey(Product, verbose_name=u'Продукт')
    count = models.IntegerField(verbose_name=u'Количество')

    class Meta:
        verbose_name = u'Позиция'
        verbose_name_plural = u'Позиции'

    def __unicode__(self):
        return u'%s: %s' % (self.product.name, self.count)

    def __str__(self):
        return self.__unicode__()


class Order(models.Model):
    ORDER_CHOICES = (
        (u'new', u'Новый'),
        (u'paid', u'Оплачен'),
        (u'ship', u'Отгружен'),
        (u'sent', u'Отправлен'),
        (u'cls', u'Закрыт'),
        (u'cnl', u'Отменен'),)
    client = models.ForeignKey(Client, verbose_name=u'Клиент')

    date_create = models.DateTimeField(auto_now_add=True,
                                       verbose_name=u'Создан')

    date_change = models.DateTimeField(auto_now=True, verbose_name=u'Изменен')

    items = models.ManyToManyField(OrderItem, verbose_name=u'Позиции')

    sum = models.DecimalField(verbose_name=u'Сумма', max_digits=6, default=0.0,
                              decimal_places=2)

    status = models.CharField(verbose_name=u'Статус', max_length=5,
                              choices=ORDER_CHOICES, default='new')

    postal_code = models.CharField(verbose_name=u'Номер почтового отправления',
                                   max_length=150, blank=True)

    class Meta:
        verbose_name = u'Заказ'
        verbose_name_plural = u'Заказы'

    def __unicode__(self):
        return u'%s: %s' % (self.client.name, self.sum)

    def __str__(self):
        return self.__unicode__()

    def save(self, force_insert=False, force_update=False, using=None,
             update_fields=None):

        postal_code_old = Order.objects.get(pk=self.pk).postal_code

        super(Order, self).save(force_insert=False, force_update=False,
                                using=None, update_fields=None)

        if postal_code_old == '' and self.postal_code != '':
            print('send message for %s' % self.client.email)


class News(models.Model):
    title = models.CharField(verbose_name=u'Заголовок', max_length=150)
    teaser = RichTextUploadingField(verbose_name=u'Тизер')
    text = RichTextUploadingField(verbose_name=u'Текст')
    date = models.DateTimeField(verbose_name=u'Дата и время')

    class Meta:
        verbose_name = u'Новость'
        verbose_name_plural = u'Новости'

    def __unicode__(self):
        return self.title

    def __str__(self):
        return self.__unicode__()
