#!/usr/bin/env python
# encoding: utf-8
"""
outputtest.py

Created by Christopher Bess on 2008-05-20.
Copyright (c) 2008 Christopher Bess. All rights reserved.
"""

import unittest
import testcase
import time

class LFOutputTest(testcase.BaseTestCase):
    def setUp(self):
        super(LFOutputTest, self).setUp()
        
        from lionface.output import LFOutput
        self.lfoutput = LFOutput()
        pass

    def test_output_write(self):
        """ test_output """
        self.assert_(self.lfoutput.write(
            "test_output_write - current time tuple is: %s" 
            % (time.localtime().__str__())) == True)
        
if __name__ == '__main__':
    unittest.main()