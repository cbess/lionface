#!/usr/bin/env python
# encoding: utf-8
"""
utilstest.py

Created by Christopher Bess on 2008-05-18.
Copyright (c) 2008 Christopher Bess. All rights reserved.
"""

import sys
import unittest
import testcase
import time

class UtilTest(testcase.BaseTestCase):

    def setUp(self):
        super(UtilTest, self).setUp()
        
        import lionface.utils
        self.Util = lionface.utils.Util
        pass

    def test_util_output(self):
        """ testUtilsOutput """        
        self.Util.output("test_util_output - current time tuple: %s" % (str(time.localtime())))
        self.Util.write_response()
        pass
        
    def test_cannot_instantiate_util(self):
        """ test_cannot_instantiate_util """
        passed = False
        try:
            tmp = self.Util()
        except NotImplementedError:
            passed = True
        # an exception was raised
        self.failIf(not passed, "No exception was raised during the attempted Util instantiation")
        pass
        
    def test_is_async_response(self):
        """ test_is_async """
        self.assert_(self.Util.is_async() == False, "This is not an asynchronous response or request")
    
    def test_exec_js(self):
        """ exec_js """
        self.assert_(self.Util.exec_js("alert('test')"), "Unable to pass javascript to output buffer")
        self.Util.write_response()
        
    def test_dump_response(self):
        """docstring for test_dump_response"""
        self.Util.ajax.send_innerhtml("divid", "inner text response")
        self.assert_((len(self.Util.dump_response()) > 0), "Unable to dump the Util response string")
		
if __name__ == '__main__':
    testcase.run_all(UtilTest)
    