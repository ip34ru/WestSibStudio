# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import ckeditor_uploader.fields


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Brand',
            fields=[
                ('id', models.AutoField(serialize=False, auto_created=True, verbose_name='ID', primary_key=True)),
                ('name', models.CharField(max_length=150, verbose_name='Название')),
                ('slug', models.CharField(max_length=150, verbose_name='Слаг', blank=True)),
                ('tagline', models.CharField(max_length=150, verbose_name='Слоган')),
                ('text', ckeditor_uploader.fields.RichTextUploadingField(verbose_name='Описание')),
            ],
            options={
                'verbose_name_plural': 'Производители',
                'verbose_name': 'Производитель',
            },
        ),
        migrations.CreateModel(
            name='Client',
            fields=[
                ('id', models.AutoField(serialize=False, auto_created=True, verbose_name='ID', primary_key=True)),
                ('name', models.CharField(max_length=150, verbose_name='ФИО')),
                ('phone', models.CharField(max_length=50, verbose_name='Телефон', blank=True)),
                ('company', models.CharField(max_length=150, verbose_name='Компания')),
                ('email', models.EmailField(max_length=254, verbose_name='E-mail')),
                ('address', models.TextField(verbose_name='Адрес')),
                ('town', models.CharField(max_length=150, verbose_name='Город')),
                ('country', models.CharField(max_length=150, verbose_name='Страна')),
                ('zip', models.CharField(max_length=150, verbose_name='Индекс')),
            ],
            options={
                'verbose_name_plural': 'Клиенты',
                'verbose_name': 'Клиент',
            },
        ),
        migrations.CreateModel(
            name='Logo',
            fields=[
                ('id', models.AutoField(serialize=False, auto_created=True, verbose_name='ID', primary_key=True)),
                ('main_image', models.ImageField(upload_to='logos', verbose_name='Главное изображение')),
                ('scroll_image', models.ImageField(upload_to='logos', verbose_name='Изображение при скролле')),
            ],
            options={
                'verbose_name_plural': 'Логотипы сайта',
                'verbose_name': 'Логотип сайта',
            },
        ),
        migrations.CreateModel(
            name='News',
            fields=[
                ('id', models.AutoField(serialize=False, auto_created=True, verbose_name='ID', primary_key=True)),
                ('title', models.CharField(max_length=150, verbose_name='Заголовок')),
                ('teaser', ckeditor_uploader.fields.RichTextUploadingField(verbose_name='Тизер')),
                ('text', ckeditor_uploader.fields.RichTextUploadingField(verbose_name='Текст')),
                ('date', models.DateTimeField(verbose_name='Дата и время')),
            ],
            options={
                'verbose_name_plural': 'Новости',
                'verbose_name': 'Новость',
            },
        ),
        migrations.CreateModel(
            name='Notes',
            fields=[
                ('id', models.AutoField(serialize=False, auto_created=True, verbose_name='ID', primary_key=True)),
                ('title_text', models.CharField(max_length=255, verbose_name='Title', blank=True, null=True)),
                ('h_text', models.CharField(max_length=255, verbose_name='Заголовок', blank=True, null=True)),
                ('footer', models.CharField(max_length=255, verbose_name='Текст подвала', blank=True, null=True)),
            ],
            options={
                'verbose_name_plural': 'Описания',
                'verbose_name': 'Описание',
            },
        ),
        migrations.CreateModel(
            name='Order',
            fields=[
                ('id', models.AutoField(serialize=False, auto_created=True, verbose_name='ID', primary_key=True)),
                ('date_create', models.DateTimeField(auto_now_add=True, verbose_name='Создан')),
                ('date_change', models.DateTimeField(auto_now=True, verbose_name='Изменен')),
                ('sum', models.DecimalField(max_digits=6, verbose_name='Сумма', decimal_places=2, default=0.0)),
                ('status', models.CharField(max_length=5, verbose_name='Статус', choices=[('new', 'Новый'), ('paid', 'Оплачен'), ('ship', 'Отгружен'), ('sent', 'Отправлен'), ('cls', 'Закрыт'), ('cnl', 'Отменен')], default='new')),
                ('postal_code', models.CharField(max_length=150, verbose_name='Номер почтового отправления', blank=True)),
                ('client', models.ForeignKey(verbose_name='Клиент', to='app.Client')),
            ],
            options={
                'verbose_name_plural': 'Заказы',
                'verbose_name': 'Заказ',
            },
        ),
        migrations.CreateModel(
            name='OrderItem',
            fields=[
                ('id', models.AutoField(serialize=False, auto_created=True, verbose_name='ID', primary_key=True)),
                ('count', models.IntegerField(verbose_name='Количество')),
            ],
            options={
                'verbose_name_plural': 'Позиции',
                'verbose_name': 'Позиция',
            },
        ),
        migrations.CreateModel(
            name='Photo',
            fields=[
                ('id', models.AutoField(serialize=False, auto_created=True, verbose_name='ID', primary_key=True)),
                ('image', models.ImageField(upload_to='images/', verbose_name='Изображение')),
                ('text', models.CharField(max_length=150, verbose_name='Текст', blank=True)),
            ],
            options={
                'verbose_name_plural': 'Изображения',
                'verbose_name': 'Изображение',
            },
        ),
        migrations.CreateModel(
            name='Product',
            fields=[
                ('id', models.AutoField(serialize=False, auto_created=True, verbose_name='ID', primary_key=True)),
                ('name', models.CharField(max_length=150, verbose_name='Название')),
                ('slug', models.CharField(max_length=150, verbose_name='Слаг', blank=True)),
                ('text', ckeditor_uploader.fields.RichTextUploadingField(verbose_name='Описание')),
                ('price', models.DecimalField(max_digits=6, verbose_name='Цена', decimal_places=2, default=0.0)),
                ('price_discont', models.DecimalField(max_digits=6, verbose_name='Цена со скидкой', decimal_places=2, default=0.0)),
                ('gallery', models.ManyToManyField(to='app.Photo', verbose_name='Изображения', blank=True)),
                ('main_image', models.ForeignKey(to='app.Photo', related_name='main_image', verbose_name='Главное изображение', blank=True, null=True)),
                ('miniature_image', models.ForeignKey(to='app.Photo', related_name='miniature_image', verbose_name='Миниатюрное изображение', blank=True, null=True)),
            ],
            options={
                'verbose_name_plural': 'Продукты',
                'verbose_name': 'Продукт',
            },
        ),
        migrations.AddField(
            model_name='orderitem',
            name='product',
            field=models.ForeignKey(verbose_name='Продукт', to='app.Product'),
        ),
        migrations.AddField(
            model_name='order',
            name='items',
            field=models.ManyToManyField(verbose_name='Позиции', to='app.OrderItem'),
        ),
        migrations.AddField(
            model_name='brand',
            name='logo',
            field=models.ForeignKey(to='app.Photo', related_name='main_photo', verbose_name='Главное изображение', blank=True, null=True),
        ),
        migrations.AddField(
            model_name='brand',
            name='products',
            field=models.ManyToManyField(to='app.Product', verbose_name='Продукты', blank=True),
        ),
    ]
