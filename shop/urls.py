from django.conf.urls import include, url, patterns
from django.contrib import admin
from app.views import *
from django.conf import settings

urlpatterns = [
    url(r'^$', Home.as_view(), name='home'),
    url(r'^ajax/brands/', Brands_View.as_view(), name='brands'),
    url(r'^ajax/news/', News_View.as_view(), name='news'),
    url(r'^ajax/notes/', Notes_View.as_view(), name='notes'),
    url(r'^ajax/logo/', Logo_View.as_view(), name='logo'),
    url(r'^ajax/cart/', Cart_View.as_view(), name='cart'),
    url(r'^ajax/nowyear/', Now_Year.as_view(), name='nowyear'),
    url(r'^admin/', include(admin.site.urls)),
    url(r'^ckeditor/', include('ckeditor_uploader.urls')),
    url(r'^pay/paypal/', include('paypal.standard.ipn.urls')),

]

if settings.DEBUG:
    urlpatterns += patterns('',
                            url(r'^media/(?P<path>.*)$',
                                'django.views.static.serve',
                                {'document_root': settings.MEDIA_ROOT, }))
