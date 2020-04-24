from osgeo import ogr
import requests

# Requirements:
# Create an end point that returns the current attributes from a layer
# Create an end point to add new attribute for a layer
# Create an end point to edit an existing attribute

# Bounce:
# Validatation is the most important part
# Create an end point to assign a default value for a new created attribute
# Create an end point to collect a value from an existing attributes in another layer


class LayerAttributeManager(object):
    def __init__(self, connection_string):
        self.connection_string = connection_string

    def get_attributes(self, layer_name):
        ''' returns list of attributes dictionaries '''
        conn = ogr.Open(self.connection_string)
        layer = conn.GetLayer(layer_name)
        layer_defn = layer.GetLayerDefn()
        fields_count = layer_defn.GetFieldCount()
        attributes = []
        for i in range(fields_count):
            field_defn = layer_defn.GetFieldDefn(i)
            name = field_defn.GetName()
            type_code = field_defn.GetType()
            f_type = field_defn.GetFieldTypeName(type_code)
            width = field_defn.GetWidth()
            precision = field_defn.GetPrecision()
            attribute = {
                'name': name,
                'order': i,
                'type': f_type,
                'type_code': type_code,
                'width': width,
                'precision': precision,
            }
            attributes.append(attribute)
        conn = None
        return attributes

    def add_attribute(self, layer_name, attr, type_code):
        ''' 
        Creates attribute / field to an existing layer table, 
        return field index if success 
        '''
        conn = ogr.Open(self.connection_string, 1)
        layer = conn.GetLayer(layer_name)
        # create attribute / field
        layer.StartTransaction()
        field_defn = ogr.FieldDefn(attr, type_code)
        layer.CreateField(field_defn)
        layer.CommitTransaction()
        # check if created return its order
        layer_defn = layer.GetLayerDefn()
        fields_count = layer_defn.GetFieldCount()
        index = None
        for i in range(fields_count):
            field_defn = layer_defn.GetFieldDefn(i)
            if field_defn.GetName() == attr:
                index = i
                break
        conn = None
        return index

    def delete_attribute(self, layer_name, attr):
        ''' 
        Deletes attribute / field to an existing layer table, 
        '''
        conn = ogr.Open(self.connection_string, 1)
        layer = conn.GetLayer(layer_name)
        layer_defn = layer.GetLayerDefn()
        # Get Field index
        index = None
        fields_count = layer_defn.GetFieldCount()
        for i in range(fields_count):
            field_defn = layer_defn.GetFieldDefn(i)
            name = field_defn.GetName()
            if name == attr: 
                index = i
                break
        # Delete Attr / field from layer table
        if index is not None: 
            layer.DeleteField(index)
