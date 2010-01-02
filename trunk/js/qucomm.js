/* 
*	Copyright (c) 2009 Christopher Bess of Quantum Quinn
*	- C. Bess Creation - lionface.googlecode.com - 0.7
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or without
* modification, are permitted provided that the following conditions are met:
*     * Redistributions of source code must retain the above copyright
*       notice, this list of conditions and the following disclaimer.
*     * Redistributions in binary form must reproduce the above copyright
*       notice, this list of conditions and the following disclaimer in the
*       documentation and/or other materials provided with the distribution.
*
* THIS SOFTWARE IS PROVIDED BY Christopher Bess ``AS IS'' AND ANY
* EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
* WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
* DISCLAIMED. IN NO EVENT SHALL <copyright holder> BE LIABLE FOR ANY
* DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
* (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
* LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
* ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
* (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
* SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/


// C. Bess Creation - Quantum Quinn 
// Created Jul 21, 2006

// Firt things first, make sure the dependent class is defined
try {
    (Ext);
} catch (e) {
    // needs ext.js or ext-core.js
	alert("Please include ext-core.js!");
}

/**
 * QuComm class
 * @return QuComm class instance
 */
function QuComm() {
    // empty
}

/**
 * QuUtil class
 * @return QuUtil class instance
 */
function QuUtil() {

	/**
	 * Gets a DOM element
	 * @return DOM element object or null
	 */
	this.get = function(id)	
	{
	 	return Ext.getDom(id);
	};

	/**
	 * Sends async request to the server
	 * @param obj: the string or instance of the element sending the request
	 * @param eventId: the server side event identifier
	 * @return null
	 */
	this.rpc = function(obj, eventId)	
	{
	    var element = this.get(obj);
	    var id = element.getAttribute("id");
	    
		// passed to the request string after ajax object has been created
		var args = {"_LID_":id, "_LEVENT_":eventId};
	
		// disables the tag during the callback if specified
		if (element.getAttribute("qudisabled") != null)
		{
			element.disabled = true;
		} // end IF
	
        /** get the form of the element that init the callback
        * - allows for unlimited forms on one page
        * - also allows users to split up request (so extra variables are not sent)
        */
        var theform = element.form;

        // try again using dom element (image tag does not support form)
        /**
        * - maybe only things that are actually submitted by a form, support the form property
        */
        if (!theform) 
        {
            theform = document.forms[0];
        }

        // ajax request vars
        var url = null;
        var method = null;

        // only worry about form if it exists/is available
        if (theform)
        { // takes needed values from the form tag
            // disable form submission
            theform.onsubmit = function() { return false };
            
            // set the defined request method
            method = theform.method.toUpperCase();
            
            var formAction = theform.action;
    
            if (formAction == "#") 
            {
                formAction = window.location.href;
            }
            
            // set the request url target
            url = formAction;
        } // end IF
        else
        { // if no form available then perform request as a POST
                method = "POST";
                url = window.location.href;
        } // end ELSE

	    Ext.Ajax.request({
	       url : url,
	       form : theform,
	       method : method,
	       success : QuServerResponse,
	       failure : QuComm.onError,
	       params : args
        });
	}; // end

	// performs the "from server" replace
	var __UNESC = function( str ) {
	    if (Ext.isWin)
    		str = str.replace(/~@/g, "\r\n"); // for win32/ie text
		str = str.replace(/~!/g, "\n"); // for other text
		return str;
	};

	// tries to remove any chars before the server response
	var __TRIM = function( str ) {
		return str;
	};

	/**
	 * Performs a replace so the server sends less
	 * @return a cleaned string
	 */
	var __CLEAN = function( str ) {	
		/* - replaces new lines (then __UNESC will replace the placeholder)
		* other than doing it on the server
		*
		* - performs the win32 match first since it also has '\n' in addition to '\r'
		*/
	    // uncomment below if using win32 server
    	//str = str.replace(/\r\n/g, "~@"); // replaces win32 new lines
		//str = str.replace(/\n/g, "~!"); // replaces unix/other new lines
		return str;
	};

	/**
	 * Receives the qucomm server response
	 * @return null
	 */
	var QuServerResponse = function(req, params) 
	{
		// replace abbrev. syntax with full syntax
		var response = __TRIM(__CLEAN(req.responseText));
		var quresponse = null;
	    QuComm.Util.log("QuServerResponse: "+response);
		
		try 
		{
		    // create quresponse array from dynamic function (alternative to eval function)
	    	var qufunc = new Function("return {"+response+"'':''};");
	
	    	// returns the quresponse array
	    	quresponse = qufunc();
	
	    	// parses response and assigns specified values to target elements	
	    	parseQuResponse(quresponse);
	
	    	// cleanup
	    	delete qufunc;
	    	delete quresponse;
	    	qufunc = null;
	    	quresponse = null;	
		} 
		catch (e) 
		{ 
		    if (QuComm.DEBUG) 
			{
				// if no custom error handler set
				if (QuComm.onError == null) 
				{
					alert("["+ e +"] Error occured during quresponse parse: "+ req.responseText); 
				}
			}
		
			if (QuComm.onError) 
			{
				QuComm.onError(e, req);
			}
		} // end TRY-CATCH
	};

	/**
	 * Parses the async qucomm response
	 * @return null
	 */
	var parseQuResponse = function(quobj) 
	{
		for(var qur in quobj)
		{		
			if (qur.length > 0)
			{			
				/** - the second index of the split since it will be the ID
				 * - this approach is great because if the user tries to set the same
				 * value twice then it will only do the last one (identical keys replace each other)
				 * - using property at ID notation (PROPERTY@ID)
				 */			
				var quarr = qur.split("@");
			
				var quid = quarr[1]; // element ID (string)
				var qutag = QuComm.Util.get(quid); // dom element object
				var quval = quobj[qur]; // element value(s) (string/array)
			
				// assign values to element properties based on given alias/shorthand
				if (qutag || quid=="JS") switch (quarr[0])
				{				
					case 'DIS': // JS_DISPLAY
					qutag.style.display = quval;
					break;
			
					case 'IH': // JS_INNER_HTML
					qutag.innerHTML = __UNESC(quval);
					break;
			
					case 'V': // JS_VALUE
					qutag.value = __UNESC(quval);
					break;
			
					case 'CSS': // JS_CLASS
					qutag.className = quval;
					break;
				
					case 'OPT': // JS_OPTION
					if (quval == 'CLEAR')
					{ // clears the options array
						qutag.options.length = 0;
					} // end IF
					else
					{
						// add new option to the list
						qutag.options[qutag.options.length] = new Option(quval[0], quval[1], false);
					} // end ELSE
					break;
				
					case 'SRC': // JS_IMG_SRC
					qutag.src = quval;
					break;
				
					case 'DS': // JS_DISABLED
					qutag.disabled = (quval == "true");
					break;
				
					case "JSC": // JS_CODE
					eval(quval);
					break;
				} // end SWITCH
				else { // if qutag == null
					throw quid;
				} // end ELSE
			} // end FOR
		} // end IF
	};

	/**
	 * Displays the string in a new popup window
	 * @param [str] the string to display
	 * @return null
	 */
	this.toNewWindow = function( str )
	{
		var win = window.open();
		win.document.write(str);
		delete win;
	};

	/**
	 * Outputs the specified string to the console
	 * @return null
	 */
    this.log = function( str ) 
	{
		if (QuComm.DEBUG)
		{
			console.log(str);
		} // end IF
	};
	
} // end QuUtil class

// add the Utils to QuComm (singleton)
QuComm.Util = new QuUtil();
QuComm.rpc = function(obj, eventId) {
    return QuComm.Util.rpc(obj, eventId); // shorthand
};

/**
 * Handles any rpc errors (function)
 * @param string [msg] error message
 * @param object [request] the async request object
 */
QuComm.onError = null;

/**
 * Gets/Sets the debug state
 * @return true|false
 */
QuComm.DEBUG = true;

// for django is_async
Ext.Ajax.defaultHeaders = {
    'HTTP_X_REQUESTED_WITH' : 'XMLHttpRequest'
};