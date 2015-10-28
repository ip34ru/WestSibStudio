from django.contrib import admin
from .models import *


class BrandAdmin(admin.ModelAdmin):
    filter_horizontal = ('products',)
    list_display = ('get_admin_th', 'name', 'tagline')
    list_filter = ('name',)


class ProductAdmin(admin.ModelAdmin):
    filter_horizontal = ('gallery',)
    list_filter = ('name',)
    list_display = ('get_admin_th', 'name', 'price', 'price_discont', 'is_discont')


class OrderAdmin(admin.ModelAdmin):
    filter_horizontal = ('items',)
    list_filter = ('status', 'client', 'date_create', 'date_change', 'sum', 'postal_code')
    list_display = ('pk', 'status', 'client', 'date_create', 'date_change', 'sum', 'postal_code')


admin.site.register(Brand, BrandAdmin)
admin.site.register(Client)
admin.site.register(Order, OrderAdmin)
admin.site.register(Product, ProductAdmin)
admin.site.register(Photo)
admin.site.register(Logo)
admin.site.register(Notes)
admin.site.register(OrderItem)
admin.site.register(News)
