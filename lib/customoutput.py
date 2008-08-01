#!/usr/bin/env python
# encoding: utf-8
"""
customoutput.py

Created by Christopher Bess on 2008-05-21.
Copyright (c) 2008 Christopher Bess. All rights reserved.
"""

from lionface.interfaces import IOutput

class CustomOut(IOutput):
    """docstring for CustomOut"""
    def __init__(self):
        super(CustomOut, self).__init__()
        
    def write(self, text):
        """ write """
        print "ok then"+text