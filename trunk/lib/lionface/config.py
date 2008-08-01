#!/usr/bin/env python
# encoding: utf-8
"""
globals.py

Defines global properties for LionFace
This is the only file you can "freely" modify

Created by Christopher Bess on 2008-05-17.
Copyright (c) 2008 Christopher Bess. All rights reserved.
"""

import os
import sys
# add the parent dir to the lib search path (for convenience)
sys.path.append(os.path.abspath(".."))

# Custom imports start

# imports end

CustomRender = None
""" 
The custom render class instance that conforms to interfaces.IRender 

C{CustomRender} must implement render()
"""

CustomOutput = None
""" 
The custom output class instance that conforms to interfaces.IOutput 

C{CustomOutput} must implement write(text)
"""

CustomAsyncDelegate = None
""" 
The custom asynchronous request delegate object

Required methods:

is_async() - This is a function that determines if the request is
asynchronous. Return True if the request is asynchronous, False otherwise (Page Load)
 """