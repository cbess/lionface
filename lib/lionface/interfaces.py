#!/usr/bin/env python
# encoding: utf-8
"""
interfaces.py

Created by Qu on 2008-05-18.
Copyright (c) 2008 __MyCompanyName__. All rights reserved.
"""

class IRender(object):
    """ The interface for all render objects """
    
    def render(self):
        """ The interface to the write method 
        text -- the string to render
        """
        raise AttributeError, "Please implement the IRender interface method render(text)"


class IOutput(object):
    """ The interface for all output objects """
    
    def write(self, text):
        """ writes the text to the out buffer """
        raise AttributeError, "Please implement the IOutput interface method write(text)"
        