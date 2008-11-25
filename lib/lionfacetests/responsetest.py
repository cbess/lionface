#!/usr/bin/env python
# encoding: utf-8
"""
responsetest.py

Created by Christopher Bess on 2008-05-21.
Copyright (c) 2008 Christopher Bess. All rights reserved.
"""

import unittest
import testcase


class ResponseTest(testcase.BaseTestCase):
    def setUp(self):
        super(ResponseTest, self).setUp()
        
        from lionface.output import Response
        self.response = Response()
        pass

    def test_is_async(self):
        """ test_is_async """
        self.assert_(self.response.is_async() == False, "This operation is not asynchronous");
        
    def test_write(self):
        """ test_write """
        buf = "test"
        self.response.write(buf)
        self.assert_(len(self.response) > 0, "Unable to write the buffer")

    def test_write_response(self):
        """ test_write_response """
        self.assert_(self.response.write_response(), 
            "Failed to write the response buffer to the out buffer")
        pass
        
    def test_store_buffer(self):
        """ test_store_buffer """
        count = 20
        self.response.store_buffer("storing the count to %d: " % (count))
        for s in range(0, count):
            self.response.store_buffer(str(s) +" ")
        self.assert_((len(self.response) > count), "The buffer is not being stored")
        
    def test_write_response_and_clear_buffer(self):
        """ test_clear_buffer """
        self.test_store_buffer()
        self.response.write_response()
        self.assert_(len(self.response) == 0, "The buffer is not clearing")
        
        
if __name__ == '__main__':
    testcase.run_all(ResponseTest)