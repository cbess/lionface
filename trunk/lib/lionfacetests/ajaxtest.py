#!/usr/bin/env python
# encoding: utf-8
"""
ajaxtest.py

Created by Qu on 2008-05-23.
Copyright (c) 2008 __MyCompanyName__. All rights reserved.
"""

import unittest
import testcase
testcase.set_sys_path()
import lionface.utils

class AjaxTest(testcase.BaseTestCase):
    def setUp(self):
        super(AjaxTest, self).setUp()
        
        from lionface.utils import Ajax
        self.Util = lionface.utils.Util
        pass

    def test_send_repsonse(self):
        """ test_send_repsonse """
        self.assert_(self.Util.ajax.send_response(lionface.utils.JS_CODE, "testid", "alert('test')"), "Ajax send response failed.")
        self.assert_(self.Util.ajax.send_value("testid", "it's \" the greatest\/gest"), "Ajax send value failed.")
        self.Util.write_response()
        pass
        
    def test_empty_response(self):
        """ test_empty_response """
        self.failIf(self.Util.ajax.send_class("testid", ""), "Empty Ajax response value was not checked.")
        pass
        
    def test_must_have_id(self):
        """ test_must_have_id """
        self.assert_(self.Util.ajax.send_jscode("alert('test')"), "JS_CODE should be allowed to send a response without an ID")
        self.failIf(self.Util.ajax.send_response(lionface.utils.JS_VALUE, "", "alert('test')"), "Allowed an absent ID in the sent response.")
        
    def test_escape(self):
        """ test_escape """
        string = "'\/"
        self.assert_(len(self.Util.ajax.escape(string)) > len(string), "The string was not escaped");
        pass
        

if __name__ == '__main__':
    unittest.main()