#!/usr/bin/env python
# encoding: utf-8
"""
utils.py

Created by Christopher Bess on 2008-05-17.
Copyright (c) 2008 Christopher Bess. All rights reserved.
"""

import sys
from output import Response

# constants
JS_INNER_HTML = "IH"
JS_VALUE = "V"
JS_DISPLAY = "DIS"
JS_DISABLED = "DS"
JS_OPTION = "OPT"
JS_CLASS = "CSS"
JS_CODE = "JSC"
JS_IMG_SRC = "SRC"
JS_TIMER = "TMR"


class Util(object):
    """ The class for all utility methods """
    
    __output = Response()
    __ajax = None
    
    def __init__(self):
        """
        Do not instantiate!
        
        This is a static class
        """
        raise NotImplementedError, "Util is a static class"
        # this is a static class

    @staticmethod
    def output(text):
        """ 
        output the text to the out buffer 
        
        @param outbuffer: the custom output buffer class
        @return: true if the text was passed to the output buffer, false otherwise
        """        
        Util.__output.write(text)
        return True
    
    @staticmethod
    def exec_js(src):
        """ Sends the specified source to the response buffer"""
        if Util.__ajax is None:
            Util.__output.write(src)
        else:
            Util.__ajax.send_jscode(src)
        return True
        
    @staticmethod
    def is_async():
        """ Determines if the request is asynchronous"""
        return Response.is_async()

    @staticmethod
    def write_response():
        """Writes the response to the out buffer"""
        return Util.__output.write_response()

    @staticmethod
    def response_length():
        """The total size in chars of the response buffer"""
        return len(Util.__output)
    
    @staticmethod
    def dump_response():
        """ Returns the current response buffer as a string, clears the response buffer """
        return Util.__output.dump_buffer()
        
# end class Util


class Ajax(object):
    """ Handles ajax responses"""
    
    def __init__(self):
        pass

    def escape(self, text):
        """add escape slashes where appropriate"""
        text = text.replace("\\", "\\\\")
        text = text.replace("'", "\\'")
        return text
        
    def write_response(self):
        """Writes the response to the asynchronous out buffer"""
        return Util.write_response()

    def send_response(self, jstype, id, value, **args):
        """
        Sends the target value response type 
        associated with id to the response buffer

        @param jstype: the JS ajax response type
        @param args: the arguments to send to the response (id, value, etc)
        """   
        if id == "":
            id = None
        if value is None:
            value = ""
            
        canSend = True
        isJsCode = (jstype == JS_CODE)
        
        if id is None and not isJsCode:
            return False
        else:
            canSend = (len(value) > 0)

        # escape the value
        if jstype == JS_INNER_HTML \
            or jstype == JS_VALUE:
            value = self.escape(value)
            canSend = True # send even if its empty

        if isJsCode:
            value = self.escape(value)
            
        if canSend:
            if isJsCode: # if js then assign id
                id = "JS"
            # print the response (adds the reponse to the out buffer)
            Util.output("'%s@%s':'%s'," % (jstype, id, value))
        return canSend

    def send_innerhtml(self, id, value):
        """Sends the specified innerhtml value to the response buffer"""
        return self.send_response(JS_INNER_HTML, id, value)

    def send_value(self, id, value):
        """Sends the specified value to the response buffer"""
        return self.send_response(JS_VALUE, id, value)

    def send_display(self, id, value):
        """Sends the specified CSS display value to the response buffer"""
        return self.send_response(JS_DISPLAY, id, value)

    def send_disabled(self, id, value):
        """Sends the specified disabled value to the response buffer"""
        if value is True:
            value = "true"
        elif value is False:
            value = "false"
        return self.send_response(JS_DISABLED, id, value)

    def send_add_option(self, **args):
        """Sends the specified text [and value] to the response buffer"""
        pass

    def send_clear_options(self, **args):
        """Sends the clear option message to the response buffer"""
        pass

    def send_class(self, id, value):
        """Sends the specified CSS class value to the response buffer"""
        return self.send_response(JS_CLASS, id, value)

    def send_jscode(self, value):
        """Sends the specified javascript code to the response buffer"""
        return self.send_response(JS_CODE, None, value)
        
# end class Ajax


# assign the an ajax instance to Util
Util.ajax = Ajax()
