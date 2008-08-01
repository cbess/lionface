#!/usr/bin/env python
# encoding: utf-8
"""
widgettest.py

Created by Christopher Bess on 2008-05-17.
Copyright (c) 2008 Christopher Bess. All rights reserved.
"""

import unittest
import testcase

class WidgetTests(testcase.BaseTestCase):
    def setUp(self):
        super(WidgetTests, self).setUp()
        
        from lionface.utils import Util
        from lionface.widget import Widget
        self.widget = Widget("id")
        self.Util = Util
        pass
        
    def test_buffer_render(self):
        buf = "test"
        self.widget.set_buffer(buf)
        self.assert_(self.widget.render() == buf, "Did not render the correct string")
        pass
  
    def test_send_jscode(self):
        """ test_exec_js """
        self.assert_(self.widget.send_jscode("alert('test')"), "Unable to add the javascript to the output buffer")
        self.Util.write_response()
        pass
        
    def test_send_innerhtml(self):
        """ test_send_innerhtml """
        self.assert_(self.widget.send_innerhtml("this ' is the html"), "Unable to add the innerhtml to the output buffer")
        self.Util.write_response()
    
if __name__ == '__main__':
    unittest.main()