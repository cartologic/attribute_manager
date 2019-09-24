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
                         recalculate_geoserver_layer_attributes, refresh_geoserver)
from .utils import create_connection_string, table_exist


@login_required
def index(request):
    return render(request, template_name="%s/index.html" % APP_NAME,
                  context={'message': 'Hello from %s' % APP_NAME, 'app_name': APP_NAME})


@login_required
def get_attributes(request):
    if request.method == 'GET':
        layer_name = request.GET.get('layer_name', None)
        if layer_name:
            # TODO: resolve layer first of all with permission can change resource base
            connection_string = create_connection_string()
            lam = LayerAttributeManager(connection_string)
            attrs = lam.get_attributes(str(layer_name))
            json_response = {"total": len(attrs), 'objects': attrs}
            return JsonResponse(json_response, status=200)
        else:
            json_response = {"status": False,
                             "message": "Empty layer_name string!", }
            return JsonResponse(json_response, status=500)


@login_required
def create_attribute(request):
    if request.method == 'POST':
        layer_name = request.POST.get('layer_name', None)
        attribute_name = request.POST.get('attribute_name', None)
        attribute_type = request.POST.get('attribute_type', None)

        # 1. Create attribute Process
        connection_string = create_connection_string()
        lam = LayerAttributeManager(connection_string)
        try:
            index = lam.add_attribute(
                str(layer_name),
                str(attribute_name),
                int(attribute_type),
            )
        except Exception as e:
            print('Error while creating attribute!', e)
            json_response = {"status": False,
                             "message": "Error while creating attribute!"}
            return JsonResponse(json_response, status=500)

        # 2. Recalculate attributes in GeoServer
        recalculate_geoserver_layer_attributes(layer_name, attrs=[attribute_name])
        # TODO: find another solution hence this will affect the other processes in the same time!
        # TODO: Refresh geoserver could be a less frequent process, so it is okay to keep that way, however an that handles reset and reload geoserver catalog will be great!
        # Refresh and reset geoserver datastores!
        refresh_geoserver()

        # 3. Set Attributes in GeoNode
        layer = Layer.objects.get(name=layer_name)
        set_attributes_from_geoserver(layer, overwrite=True)

        return JsonResponse({'success': True}, status=200)


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
