# coding=utf-8
from django.db import models
from ckeditor.fields import RichTextField


class Client(models.Model):
    name = models.CharField(verbose_name=u'ФИО', max_length=150)
    phone = models.CharField(verbose_name=u'Телефон', max_length=50, blank=True)
    company = models.CharField(verbose_name=u'Компания', max_length=150)
    email = models.EmailField(verbose_name=u'E-mail')
    address = models.TextField(verbose_name=u'Адрес')
    town = models.CharField(verbose_name=u'Город', max_length=150)
    country = models.CharField(verbose_name=u'Страна', max_length=150)
    zip = models.CharField(verbose_name=u'Страна', max_length=150)

    class Meta:
        verbose_name = u'Клиент'
        verbose_name_plural = u'Клиенты'

    def __unicode__(self):
        return self.name


class Product (models.Model):
    name = models.CharField(verbose_name=u'Название', max_length=150)
    text = RichTextField(verbose_name=u'Описание')
    image = models.ImageField(verbose_name=u'Изображение', upload_to=u'/products')
    price = models.DecimalField(verbose_name=u'Цена', max_digits=6, default=0.0, decimal_places=2)

    class Meta:
        verbose_name = u'Продукт'
        verbose_name_plural = u'Продукты'

    def __unicode__(self):
        return self.name


class Brand (models.Model):
    name = models.CharField(verbose_name=u'Название', max_length=150)
    tagline = models.CharField(verbose_name=u'Слоган', max_length=150)
    text = RichTextField(verbose_name=u'Описание')
    products = models.ManyToManyField(Product, verbose_name=u'Продукты', blank=True, null=True)

    class Meta:
        verbose_name = u'Производитель'
        verbose_name_plural = u'Производители'

    def __unicode__(self):
        return self.name


class OrderItem(models.Model):
    product = models.ForeignKey(Product, verbose_name=u'Продукт')
    count = models.IntegerField(verbose_name=u'Количество')

    class Meta:
        verbose_name = u'Позиция'
        verbose_name_plural = u'Позиции'

    def __unicode__(self):
        return u'%s: %s' % (self.product.name, self.count)


class Order(models.Model):
    ORDER_CHOICES = (
        (u'new', u'Новый'),
        (u'paid', u'Оплачен'),
        (u'ship', u'Отгружен'),
        (u'sent', u'Отправлен'),
        (u'cls', u'Закрыт'),
        (u'cnl', u'Отменен'),)
    client = models.ForeignKey(Client, verbose_name=u'Клиент')
    date_create = models.DateTimeField(auto_now_add=True, verbose_name=u'Создан')
    date_change = models.DateTimeField(auto_now=True, verbose_name=u'Изменен')
    items = models.ManyToManyField(OrderItem, verbose_name=u'Позиции')
    sum = models.DecimalField(verbose_name=u'Сумма', max_digits=6, default=0.0, decimal_places=2)
    status = models.CharField(verbose_name=u'Статус', max_length=5, choices=ORDER_CHOICES, default='new')

    class Meta:
        verbose_name = u'Заказ'
        verbose_name_plural = u'Заказы'

    def __unicode__(self):
        return u'%s: %s' % (self.client.name, self.sum)
