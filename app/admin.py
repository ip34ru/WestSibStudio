from django.contrib import admin
from .models import *


class BrandAdmin(admin.ModelAdmin):
    filter_horizontal = ('products',)
    list_display = ('get_admin_th', 'name', 'tagline')
    list_filter = ('name',)


class ProductAdmin(admin.ModelAdmin):
    filter_horizontal = ('gallery',)
    list_filter = ('name',)
    list_display = ('get_admin_th', 'name', 'price')


admin.site.register(Brand, BrandAdmin)
admin.site.register(Client)
admin.site.register(Order)
admin.site.register(Product, ProductAdmin)
admin.site.register(Photo)
admin.site.register(Logo)
admin.site.register(Notes)
admin.site.register(OrderItem)
admin.site.register(News)
