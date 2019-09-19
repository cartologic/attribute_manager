import json
import os
import re
import uuid

from django.conf import settings
from django.contrib.auth.decorators import login_required
from django.forms import ValidationError
from django.http import JsonResponse
from django.shortcuts import get_object_or_404, render

from geonode.base.models import ResourceBase
from geonode.geoserver.helpers import set_attributes_from_geoserver
from geonode.layers.models import Layer

from . import APP_NAME
from .attribute_manager_logic import LayerAttributeManager
from .publishers import (publish_in_geonode, publish_in_geoserver,
                         recalculate_geoserver_layer_attributes)
from .utils import create_connection_string, table_exist


@login_required
def index(request):
    return render(request, template_name="%s/index.html" % APP_NAME,
                  context={'message': 'Hello from %s' % APP_NAME, 'app_name': APP_NAME})


@login_required
def test_logic(request):
    connection_string = create_connection_string()
    lam = LayerAttributeManager(connection_string)
    layer_name = 'b6'
    attributes = lam.get_attributes(layer_name=layer_name)
    index = lam.add_attribute(
        layer_name,
        'test_string',
        4,
    )
    index = lam.add_attribute(
        layer_name,
        'test_real',
        2,
    )
    index = lam.add_attribute(
        layer_name,
        'test_integer',
        0,
    )
    recalculate_geoserver_layer_attributes(layer_name)
    layer = Layer.objects.get(name=layer_name)
    set_attributes_from_geoserver(layer, overwrite=True)
    return render(request, template_name="%s/index.html" % APP_NAME,
                  context={'message': 'Hello from %s' % APP_NAME, 'app_name': APP_NAME})
