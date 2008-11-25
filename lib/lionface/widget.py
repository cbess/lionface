#!/usr/bin/env python
# encoding: utf-8
"""
widget.py

Created by Christopher Bess on 2008-05-17.
Copyright (c) 2008 Christopher Bess. All rights reserved.
"""

from output import LFRender
from utils import Util
from attributes import Attributes

class BaseWidget(LFRender):
    """ The base class for all objects that render """
    
    def __init__(self, id = None):
        LFRender.__init__(self)
        
        self.id = ""        
        if id is not None:
            self.id = id
        pass
        
    def send_response(self, id, type, value):
        """
        Sends the target value response type 
        associated with id to the response buffer
        """
        if id is None:
            id = self.id
        
        pass

    def render(self):
        """ Return the rendered buffer of this widget """
        return LFRender.render(self)
# end class BaseWidget        


class Widget(BaseWidget, Attributes):
    """Represents a concrete widget"""
    
    def __init__(self, id):
        BaseWidget.__init__(self, id)
        Attributes.__init__(self)
        pass
    
    def send_innerhtml(self, value):
        """Sends the specified innerhtml value to the response buffer"""
        return Util.ajax.send_innerhtml(self.id, value)
        
    def send_value(self, value):
        """Sends the specified value to the response buffer"""
        return Util.ajax.send_value(self.id, value)

    def send_display(self, value):
        """Sends the specified CSS display value to the response buffer"""
        return Util.ajax.send_display(id=self.id, value=value)

    def send_disabled(self, disabled):
        """Sends the specified disabled value to the response buffer"""
        if disabled is None or disabled == False:
            disabled = False
        else:
            disabled = True
            
        return Util.ajax.send_disabled(self.id, disabled)
        
    def send_add_option(self, text, value):
        """Sends the specified text [and value] to the response buffer"""
        Util.ajax.send_add_option(text, value)
        pass
        
    def send_clear_options(self):
        """Sends the clear option message to the response buffer"""
        Util.ajax.send_clear_options(self.id)
        pass
        
    def send_class(self, value):
        """Sends the specified CSS class value to the response buffer"""
        return Util.ajax.send_class(self.id, value)
        
    def parse_jscode(self, src, **kwrds):
        """Parses the JS code before being passed to the response buffer"""
        if len(src) == 0:
            return False
        return src
    
    def send_jscode(self, value, **kwrds):
        """Sends the specified javascript code to the response buffer"""
        value = self.parse_jscode(value, **kwrds)
        return Util.ajax.send_jscode(value)
        
# end class Widget
