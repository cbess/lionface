#!/usr/bin/env python
# encoding: utf-8
"""
render.py

Created by Christopher Bess on 2008-05-17.
Copyright (c) 2008 Christopher Bess. All rights reserved.
"""

import sys
import lionfaceobject
import interfaces
from config import CustomRender, CustomOutput, CustomAsyncDelegate

class LFRender(lionfaceobject.LFObject, interfaces.IRender):
    """ Handles the lower level rendering """
    
    def __init__(self):
        lionfaceobject.LFObject.__init__(self)
        
        self._buffer = ""
        """ the text buffer for this widget """
        
        pass
        
    def set_buffer(self, buf):
        """ sets the rendered buffer """
        self._buffer = buf
        pass    
        
    def render(self):
        return self._buffer
# end class LFRender


class LFOutput(lionfaceobject.LFObject, interfaces.IOutput):
    """ Handles the lower level output buffer """
    
    def __init__(self):
        lionfaceobject.LFObject.__init__(self)
        pass
        
    def write(self, text):
        """ 
        output the text to the out buffer 
        
        override to implement custom output
        
        @param outbuffer: the custom output buffer class
        @return: true if the text was passed to the output buffer, false otherwise
        """
        
        if CustomOutput is None:
            sys.stdout.write(text)
        else:
            try:
               # if no error then call custom write            
               CustomOutput.write(text)     
            except AttributeError:
                raise AttributeError, "CustomOutput "+str(CustomOutput)+" must implement the method 'write(text)'"
                
        return True   
# end class LFOutput


class Response(LFOutput):
    """Represents the response buffer sent to the client
    
    You should never use this class directly
    """
    def __init__(self):
        super(Response, self).__init__()
        self._buffer = ""
        pass
                
    def is_async():
        """Determines if the request is asynchronous
        @return: True if the request is asynchronous, false otherwise
        """
        isasync = False

        if CustomAsyncDelegate is not None:
            try:
                # if no error then get the return value
                isasync = CustomAsyncDelegate.is_async()
            except AttributeError:
                raise AttributeError, "CustomAsyncDelegate must implement is_async()"
        # end IF
        return isasync
    is_async = staticmethod(is_async)
        
    def write(self, buf):
        """
        writes the specified text to the response
        
        @param buf: the string buffer to write to the response buffer
        """
        self.store_buffer(buf)
        pass
        
    def write_response(self):
        """writes the response to the output buffer
        
        You should never call this method directly
        """
        ret = LFOutput.write(self, self._buffer)
        self.__clear_buffer()
        return ret
        
    def store_buffer(self, buf):
        """ stores the buffer within memory before being released """
        self._buffer += buf
        pass
        
    def dump_buffer(self):
        """Returns the internal buffer as a string
        Clears the buffer
        """
        buf = self._buffer
        self.__clear_buffer()
        return buf
        
    def __clear_buffer(self):
        """clears the memory used by the stored buffer"""
        self._buffer = ""
        pass    
    
    def __len__(self):
        """Gets the length of the response buffer"""
        return len(self._buffer)
        
# end class Response
