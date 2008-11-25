#!/usr/bin/env python
# encoding: utf-8
"""
LionFaceTestCase.py

Created by Christopher Bess on 2008-05-18.
Copyright (c) 2008 Christopher Bess. All rights reserved.
"""

import unittest
import sys
import os
import time

def set_sys_path():
    """Sets the system path to include the lionface module"""
    sys.path.append(os.path.abspath('..')) # put /LionFace in the path
    pass
    
def run_all(testCase):
    """Runs all the tests for the specified test case
    """
    suite = unittest.TestLoader().loadTestsFromTestCase(testCase)
    runner = unittest.TextTestRunner(verbosity=2)
    runner.run(suite)

class BaseTestCase(unittest.TestCase):
    """ The base class for all LionFace test cases """
    
    def setUp(self):
        set_sys_path()
        pass

    def get_test_string(self):
        """
        Gets a string time tuple
        
        Used to ensure the text generated is 'unique'
        
        @return: a tuple string of the current time
        """
        return ("current time tuple: " + time.localtime().__str__())
    
if __name__ == '__main__':
    unittest.main()