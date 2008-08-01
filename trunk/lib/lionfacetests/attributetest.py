#!/usr/bin/env python
# encoding: utf-8
"""
attributetest.py

Created by Qu on 2008-05-18.
Copyright (c) 2008 __MyCompanyName__. All rights reserved.
"""

import unittest
import testcase

class AttributeTest(testcase.BaseTestCase):
    def setUp(self):
        super(AttributeTest, self).setUp()
        
        from lionface.attributes import Attributes
        self.attributes = Attributes()
        pass

    def test_set_attributes(self):
        """ test_set_attributes """
        self.attributes.set_attributes(test="great", author="christopher bess")
        self.assert_(self.attributes.collection["test"] == "great")
        pass
        
    def test_attribute_len(self):
        """ tests the attributes __len__ method """
        self.test_set_attributes()
        self.assert_(len(self.attributes) == 2, "attribute length was incorrect, should be 2 (two)")
        pass
        
    def test_attribute_getitem(self):
        """ test the attributes __getitem__ method """
        self.test_set_attributes()
        self.assert_(self.attributes["test"] == "great", "Can not get the item value")
        
if __name__ == '__main__':
    unittest.main()