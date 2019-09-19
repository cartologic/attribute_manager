from django.conf.urls import url, include

from . import views, APP_NAME

urlpatterns = [
    url(r'^$', views.index, name='%s.index' % APP_NAME),
    url(r'^test/', views.test_logic, name='%s.test_logic' % APP_NAME),
    url(r'^get/', views.get_attributes, name='%s.get_attributes' % APP_NAME),
]
