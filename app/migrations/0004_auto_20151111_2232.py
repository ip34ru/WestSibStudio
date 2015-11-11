# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0003_auto_20151028_1656'),
    ]

    operations = [
        migrations.AlterField(
            model_name='logo',
            name='main_image',
            field=models.ImageField(upload_to=b'logos', verbose_name=b'\xd0\x93\xd0\xbb\xd0\xb0\xd0\xb2\xd0\xbd\xd0\xbe\xd0\xb5 \xd0\xb8\xd0\xb7\xd0\xbe\xd0\xb1\xd1\x80\xd0\xb0\xd0\xb6\xd0\xb5\xd0\xbd\xd0\xb8\xd0\xb5'),
        ),
        migrations.AlterField(
            model_name='logo',
            name='scroll_image',
            field=models.ImageField(upload_to=b'logos', verbose_name=b'\xd0\x98\xd0\xb7\xd0\xbe\xd0\xb1\xd1\x80\xd0\xb0\xd0\xb6\xd0\xb5\xd0\xbd\xd0\xb8\xd0\xb5 \xd0\xbf\xd1\x80\xd0\xb8 \xd1\x81\xd0\xba\xd1\x80\xd0\xbe\xd0\xbb\xd0\xbb\xd0\xb5'),
        ),
        migrations.AlterField(
            model_name='photo',
            name='image',
            field=models.ImageField(upload_to=b'images/', verbose_name=b'\xd0\x98\xd0\xb7\xd0\xbe\xd0\xb1\xd1\x80\xd0\xb0\xd0\xb6\xd0\xb5\xd0\xbd\xd0\xb8\xd0\xb5'),
        ),
    ]
