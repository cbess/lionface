#!/usr/bin/env python
# encoding: utf-8
"""
Ext.py

implements the ExtJS ui classes

Created by Christopher Bess on 2008-05-19.
Copyright (c) 2008 Christopher Bess. All rights reserved.
"""

import ui

class ExtBaseWidget(ui.Widget):
    """Represents a base ExtJS widget"""
    def __init__(self, id):
        super(ExtBaseWidget, self).__init__(id)
        

class Window(ui.BaseWindow):
    """Represents a Ext.Window instance """
    def __init__(self, id):
        super(Window, self).__init__(id)
        pass
        
    def alignTo(self, id):
        """align window to element
        @param id: the id of the element
        """
        self.send_jscode(".alignTo('%s')" % (self.id, id))
        pass
        
    def render(self):
        """Renders this window"""
        self._buffer = """
        <div id="%(id)s" class="x-hidden">
    	    <div class="x-window-header">%(title)s</div>
    		<div class="x-window-body">
    		    %(body)s
    	    </div>
    	</div>
        """ % { "id": self.id, 
				"title": self.title, 
				"body" : self.render_sub() 
			}        
        return ui.BaseWindow.render(self)
