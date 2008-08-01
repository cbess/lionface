#!/usr/bin/env python
# encoding: utf-8
"""
render.py

Renders using Django templates

Created by Christopher Bess on 2008-05-18.
Copyright (c) 2008 Christopher Bess. All rights reserved.
"""

# import sys
# import os
# sys.path.append(os.path.abspath('..')) # put LionFace in the path
# 
# import djangorender.settings
# # set the evn var to our settings, so we can set the templates dirs
# os.environ['DJANGO_SETTINGS_MODULE'] = 'settings'
# 
# from djangorender.render import RenderDjango

from lionface import config
from lionface.interfaces import IRender
from lionface.interfaces import IOutput
# from django.template import Context, loader
# from django.shortcuts import render_to_response
from django.template.loader import render_to_string
from django.http import HttpResponse

class RenderDjango(IRender):
    """ Represents the class used to render using Django templates """
    def __init__(self):
        super(RenderDjango, self).__init__()
        self._templateName = ""
        pass
            
    def render(self):
        """ renders the text using a Django Template """
        dict = None
        return render_to_string(self._templateName, dict)
        
        
class OutputDjango(IOutput):
    """docstring for OutputDjango"""
    def __init__(self):
        super(OutputDjango, self).__init__()
        pass
        
    def write(self, text):
        """ writes the text using Django HttpResponse"""
        response = HttpResponse()
        response.write(text)
        return True
