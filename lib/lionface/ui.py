#!/usr/bin/env python
# encoding: utf-8
"""
ui.py

Created by Christopher Bess on 2008-05-18.
Copyright (c) 2008 Christopher Bess. All rights reserved.
"""

import config
from utils import Util
from widget import Widget
from attributes import Attributes

class BaseWindow(Widget):
    """ Represents an abstract window """
    def __init__(self, id):
        super(BaseWindow, self).__init__(id)
        
        self._subBuffer = ""
        
        # setup window properties
        self.size = ( )
        self.position = ( )
        self.title = ""
        self.canClose = True
        self.canMinimize = True
        self.canMaximize = True
        pass
        
    def render_sub(self):
        """Renders the sub components of the window"""
        return self._subBuffer
        
    def render(self):
        """renders the window"""
        
        return self._buffer
        
class BaseButton(Widget):
    """Represents an abstract button"""
    def __init__(self, id):
        super(BaseButton, self).__init__(id)
        pass
        