#!/usr/bin/env python
# encoding: utf-8
"""
exttest.py

Created by Christopher Bess on 2008-06-05.
Copyright (c) 2008 Christopher Bess. All rights reserved.
"""

import unittest
import testcase

class ExtTest(testcase.BaseTestCase):
    
    def setUp(self):
        super(ExtTest, self).setUp()
        
        from lionface import Ext
        from lionface import utils
        self.window = Ext.Window("win")
        pass

    def test_window_id(self):
        """docstring for test_window_id"""
        from lionface import Ext
        win = Ext.Window("winid")
        self.assert_((win.id == "winid"), "The Ext.Window ID is not set correctly.")
        pass
        
    def test_window_creation(self):
        """ test_window_creation """
        self.window.title = "Test Title"
        self.window.size = (200, 300)
        string = self.window.render()
        self.assert_((len(string) > 0), "The Ext.Window was not rendered.")
        print string
        
if __name__ == '__main__':
    testcase.run_all(ExtTest)