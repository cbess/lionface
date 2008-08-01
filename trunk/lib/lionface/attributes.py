#!/usr/bin/env python
# encoding: utf-8
"""
attributes.py

Created by Christopher Bess on 2008-05-17.
Copyright (c) 2008 Christopher Bess. All rights reserved.
"""

import interfaces

class Attributes(interfaces.IRender):
    """This class manipulates the attributes"""

    def __init__(self):
        self.collection = { }
        self._renderBuffer = ""
        pass
    # end __init__

    def add_attributes(self, **attrs):
        """ adds the specified attributes to this colleciton,
        replacing keys as needed
        """
        # append the attributres
        for name in attrs:
            self.collection[name] = attrs[name]
        pass
    # end addAttributes

    def set_attributes(self, **attrs):
        """ Sets the attributes for this class """
        if type(attrs) is not type({}):
            raise TypeError, "Bad attribute, must be a dictionary {string : string}"
        self.collection = attrs
        pass
    # end setAttributes
    
    def set_attribute(self, name, value):
        """ Sets the target name of the attribute name """
        self.collection[name] = value
        pass
    # end setAttributes
    
    def generate_output(self):
        """ Generates the render buffer based on the internal attributes collection """
        buffer = ""
        # build the render buffer
        for attr in self.collection:
            pass
        # set the render buffer
        self._renderBuffer = buffer
        pass
    # end generateOutput
    
    def render(self):
        """ renders the attributes 
        @rtype: string
        @return: the render buffer
        """
        return self._renderBuffer        

    def __count(self):
        return len(self.collection)
    
# native python object methods #
    
    def __len__(self):
        """Returns the total count of the attributes"""
        return self.__count()

    def __getitem__(self, key):
        """Returns the value for the specified item key"""
        return self.collection[key]
        
# end class


