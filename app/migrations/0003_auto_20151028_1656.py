# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0002_product_is_discont'),
    ]

    operations = [
        migrations.AlterField(
            model_name='order',
            name='items',
            field=models.ManyToManyField(to='app.OrderItem', blank=True, verbose_name='Позиции'),
        ),
        migrations.AlterField(
            model_name='order',
            name='sum',
            field=models.DecimalField(decimal_places=3, verbose_name='Сумма', max_digits=10, default=0.0),
        ),
    ]
