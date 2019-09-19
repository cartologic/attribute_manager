from django.conf.urls import url, include

from . import views, APP_NAME

urlpatterns = [
    url(r'^$', views.index, name='%s.index' % APP_NAME),
    url(r'^$', views.test_logic, name='%s.test_logic' % APP_NAME),
]
