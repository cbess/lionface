/* 
*	Copyright (c) 2008 Christopher Bess of Quantum Quinn
*	- C. Bess Creation - www.quantumquinn.com/lionface - 0.5
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
// updated: 2008 May 17

/**
 * QuComm class
 * @return QuComm request object or null, if the ajax request class failed
 */
function QuComm() {
	var req = new Object();
	
	// -------------------
	// Instance properties
	// -------------------

	/**
	 * Timeout period (in ms) until an async request will be aborted, and
	 * the onTimeout function will be called
	 */
	req.timeout = null;
	
	/**
	 *	Since some browsers cache GET requests via XMLHttpRequest, an
	 * additional parameter called QuCommUniqueId will be added to
	 * the request URI with a unique numeric value appended so that the requested
	 * URL will not be cached.
	 */
	req.generateUniqueUrl = true;
	
	/**
	 * The url that the request will be made to, which defaults to the current 
	 * url of the window
	 */
	req.url = window.location.href;
	
	/**
	 * The method of the request, either GET, POST(default), or HEAD
	 */
	req.method = "POST";
	
	/**
	 * Whether or not the request will be asynchronous. In general, synchronous 
	 * requests should not be used so this should rarely be changed from true
	 */
	req.async = true;
	
	/**
	 * The username used to access the URL
	 */
	req.username = null;
	
	/**
	 * The password used to access the URL
	 */
	req.password = null;
	
	/**
	 * The parameters is an object holding name/value pairs which will be 
	 * added to the url for a GET request or the request content for a POST request
	 */
	req.parameters = new Object();
	
	/**
	 * The sequential index number of this request, updated internally
	 */
	req.requestIndex = QuComm.numQuComms++;
	
	/**
	 * Indicates whether a response has been received yet from the server
	 */
	req.responseReceived = false;
	
	/**
	 * The query string to be added to the end of a GET request, in proper 
	 * URIEncoded format
	 */
	req.queryString = "";
	
	/**
	 * After a response has been received, this will hold the text contents of 
	 * the response - even in case of error
	 */
	req.responseText = null;
	
	/**
	 * After a response has been received, this will hold the XML content
	 */
	req.responseXML = null;
	
	/**
	 * After a response has been received, this will hold the status code of 
	 * the response as returned by the server.
	 */
	req.status = null;
	
	/**
	 * After a response has been received, this will hold the text description 
	 * of the response code
	 */
	req.statusText = null;

	/**
	 * An internal flag to indicate whether the request has been aborted
	 */
	req.aborted = false;
	
	/**
	 * The XMLHttpRequest object used internally
	 */
	req.xmlHttpRequest = null;

	// --------------
	// Event handlers
	// --------------
	
	/**
	 * If a timeout period is set, and it is reached before a response is 
	 * received, a function reference assigned to onTimeout will be called
	 */
	req.onTimeout = null; 

	/**
	 * A function reference assigned will be called after onComplete, if 
	 * the statusCode=200
	 */
	req.onSuccess = null;

	/**
	 * A function reference assigned will be called after onComplete, if 
	 * the statusCode not within the 200 range
	 */
	req.onError = null;

	// Get the XMLHttpRequest object itself
	req.xmlHttpRequest = QuComm.getXmlHttpRequest();
	if (req.xmlHttpRequest==null) { return null; }
	
	req.xmlHttpRequest.onreadystatechange = function() {
			if (req==null || req.xmlHttpRequest==null) { return; }
			
			if (req.xmlHttpRequest.readyState == 4) 
			{ 
				req.responseReceived = true;
				req.status = req.xmlHttpRequest.status;
				req.statusText = req.xmlHttpRequest.statusText;
				req.responseText = req.xmlHttpRequest.responseText;
				req.responseXML = req.xmlHttpRequest.responseXML;
				
				// decrement request number
				--qunum;
				
				// accepts entire 200 range
				if ((req.xmlHttpRequest.status >= 200) && (req.xmlHttpRequest.status < 300)) {
					req.onSuccess(req);
				} // end IF
				else {
					req.onError(req);
				} // end ELSE
								
			} // end IF
			
			// executes last to ensure all values/request have been processed
//			QuComm.Utils.qustatus( req.xmlHttpRequest.readyState );
			
			if (req.xmlHttpRequest.readyState == 4)
			{
				try 
				{
					// Clean up so IE doesn't leak memory
					delete req.xmlHttpRequest['onreadystatechange'];
					req.xmlHttpRequest = null;
				} catch ( e ) { }
			} // end IF
		};

	/**
	 * The process method is called to actually make the request. It builds the
	 * querystring for GET requests (the content for POST requests), sets the
	 * appropriate headers if necessary, and calls the 
	 * XMLHttpRequest.send() method
	*/
	req.process = function() {
			if (req.xmlHttpRequest!=null) {
				// Some logic to get the real request URL
				if (req.generateUniqueUrl && req.method=="GET") {
					req.parameters["QuCommUniqueId"] = new Date().getTime() + "" + req.requestIndex;
				}
				var content = null; // For POST requests, to hold query string
				for (var i in req.parameters) {
					if (req.queryString.length>0) { req.queryString += "&"; }
					req.queryString += encodeURIComponent(i) + "=" + encodeURIComponent(req.parameters[i]);
				}
				if (req.method=="GET") {
					if (req.queryString.length>0) {
						req.url += ((req.url.indexOf("?")>-1)?"&":"?") + req.queryString;
					}
				}
				req.xmlHttpRequest.open(req.method, req.url, req.async, req.username, req.password);
				if (req.method=="POST") {
					if (typeof(req.xmlHttpRequest.setRequestHeader)!="undefined") {
						req.xmlHttpRequest.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
						// add a header for django.is_ajax()
						req.xmlHttpRequest.setRequestHeader('HTTP_X_REQUESTED_WITH', 'XMLHttpRequest');
					}
					content = req.queryString;
				}
				if (req.timeout>0) {
					setTimeout(req.onTimeoutInternal,req.timeout);
				}
				req.xmlHttpRequest.send(content);
			}
		};

	/**
	 * An internal function to handle an Object argument, which may contain
	 * either QuComm field values or parameter name/values
	 */
	req.handleArguments = function(args) {
		for (var i in args) 
		{
			// If the QuComm object doesn't have a property which was passed, treat it as a url parameter
			if (typeof(req[i])=="undefined") 
			{
				req.parameters[i] = args[i];
			}
			else 
			{
				req[i] = args[i];
			}
		}
	};

	return req;
} // END CLASS

/**
 * Returns an XMLHttpRequest object, either as a core object or an ActiveX 
 * implementation. If an object cannot be instantiated, it will return null;
 */
QuComm.getXmlHttpRequest = function() {
	if (window.XMLHttpRequest) {
		return new XMLHttpRequest();
	}
	else if (window.ActiveXObject) {
		try {
			return new ActiveXObject("Msxml2.XMLHTTP");
		} catch (e) {
			try {
				return new ActiveXObject("Microsoft.XMLHTTP");
			} catch (E) {
				return null;
			}
		}
	}
	else {
		return null;
	}
};

/**
 * Serializes a form into a query string
 * @param [theform] the form object to serialize
 * @return query string
 */
QuComm.serializeForm = function(theform) {
	var els = theform.elements;
	var len = els.length;
	var queryString = "";
	this.addField = function(name, value) { 
		if (queryString.length>0) { 
			queryString += "&";
		}
		queryString += encodeURIComponent(name) +"="+ encodeURIComponent(value);
	};
		
	for (var i = 0 ; i < len ; ++i) 
	{
		var el = els[i];
		if (!el.disabled) 
		{
			switch(el.type) 
			{
				case 'text': case 'password': case 'hidden': case 'textarea': 
					this.addField(el.name, el.value);
					break;
				case 'select-one':
					if (el.selectedIndex >= 0) 
					{
						this.addField(el.name, el.options[el.selectedIndex].value);
					}
					break;
				case 'select-multiple':
					for (var j=0 ; j < el.options.length ; ++j) 
					{
						if (el.options[j].selected) 
						{
							this.addField(el.name,el.options[j].value);
						}
					}
					break;
				case 'checkbox': case 'radio':
					if (el.checked) 
					{
						this.addField(el.name,el.value);
					}
					break;
			} // end SWITCH
		} // end IF
	} // end FOR
	
	return queryString;
};

// QuUtils scope
//(function(){
	
// displays status box during ajax request
var _qustatus = null;
var _isCentered = true;

// allows multi-request status support
/**
* - this variable will keep the status message visible until all
* sent requests reply back
*/
var qunum = new Number(0);

/**
 * QuUtil class
 * @return QuUtil class object
 */
function QuUtil() {
	
	// detect if the browser is ie
	this.isIE = ( navigator.appName.indexOf("Internet Explorer") > -1 );
	
	/**
	* - used to retain the id of the last qutag that init the callback
	*/
	var _prevQutag = null;
	var qustatusText = ""; // default qustatus text

    /**
     * Handles async operation status display
     * @return null
     */
	this.qustatus = function( state )
	{
		if ( !_qustatus ) return;

		// one of the only things I get by ID
		var qustatus = document.getElementById(_qustatus);	

		if ( !qustatus ) {
			return;
		}

		if ( state != 4 )
		{
			var st = document.body.scrollTop;
			if ( _isCentered )
			{
				var h = document.body.clientHeight;
				var w = document.body.clientWidth;

				var t = (h/2)-(qustatus.offsetHeight/2);
				var l = (w/2)-(qustatus.offsetWidth/2);

				qustatus.style.top = st+t;
				qustatus.style.left = l;			
			} // end IF
			else
			{
				qustatus.style.top=st+7;
			} // end ELSE

			qustatus.style.visibility='visible';
		} // end IF
		else
		{
			if ( qunum == 0 ) 
			{ // stops it from hiding if more request are open
				qustatus.style.visibility='hidden';	

				var qutag = QU(_prevQutag);

				if ( qutag ) 
				{
					// re-enable the qutag
					if ( qutag.getAttribute("qudisabled") != null ) {
						qutag.disabled = false;				
					} // end IF qudisabled
				} // end IF qutag
			} // end IF
		} // end ELSE
	};

	/**
	 * Gets a DOM element
	 * @return DOM element object or null
	 */
	this.get = function(id)	{
	    var obj = document.getElementsByName(id)[0]
	    if (obj != null)
	        return obj;
	 	return document.getElementById(id);
	};

	/**
	 * Sends async request to the server
	 * @return null
	 */
	this.rpc = function( id, callfunc )	{
		// passed to the request string after ajax object has been created
		var args = {"_QUID_":id, "_QUFUNC_":callfunc};
	
		// assign prev qutag id
		_prevQutag = id;
	
		// assign the qutag object
		var qutag = this.get(id);
	
		// disables the tag during the callback if specified
		if ( qutag.getAttribute("qudisabled") != null ) {
			qutag.disabled = true;
		} // end IF
	
		// holds reknowned ajax object data
		var qureq = new QuComm();

		if ( !qureq) 
		{ 
			if (QuComm.DEBUG) {
				alert( "can't create QuComm object" ); 
			}
			
			return; 
		}
	
		/** get the form of the element that init the callback
		* - allows for unlimited forms on one page
		* - also allows users to split up request (so extra variables are not sent)
		*/
		var theform = this.get(id).form;
	
		// try again using dom element (image tag does not support form)
		/**
		* - maybe only things that are actually submitted by a form, support the form property
		*/
		if (!theform) {
			theform = document.forms[0];
		}

		// serialized form string
		var serForm = "";
	
		// only worry about form if it exists/is available
		if ( theform )
		{ // takes needed values from the form tag
		
			// get all the values from the current form elements
			serForm = QuComm.serializeForm(theform);
		
			// set the defined request method
			qureq.method = theform.method.toUpperCase();
		
			if ( qureq.method == "" ) {
				qureq.method = "POST";
			}
		
			var formAction = theform.action;
		
			if ( formAction == "#" ) {
				formAction = window.location.href;
			}
			
			// set the request url target
			qureq.url = formAction;
		} // end IF
		else
		{ // if no form available then perform request as a POST
			qureq.method = "POST";
			qureq.url = window.location.href;
		} // end ELSE
		
		// adds id and callfunc to the request sent
		qureq.handleArguments(args);
	
		// adds form element values
		qureq.queryString = serForm;
	
		// assign on success reponse handler
		qureq.onSuccess = QuServerResponse;
	
		// default onError handler
		if (QuComm.onError == null)
		{
			if (QuComm.DEBUG) qureq.onError = function ( req ) {
				window.status = "qucomm error: "+ req.statusText;
			}; // end onError
		}
		else
		{
			qureq.onError = function (req) {
				if (QuComm.onError)
				{
					QuComm.onError("qucomm error", req);
				}
			};
		}
	
		// increment qurequest number
		++qunum;
	
		// sends request to server
		qureq.process();
	
		delete qureq;
		qureq = null;
	}; // end

	// performs the "from server" replace
	var __UNESC = function( str ) {
		str = str.replace(/~@/g, "\r\n"); // for win32/ie text
		str = str.replace(/~!/g, "\n"); // for other text
		return str;
	};

	// tries to remove any chars before the server response
	var __TRIM = function( str ) {
		return str.replace(/.*?QUTAGS/, "");
	};

	/**
	 * Performs a replace so the server sends less
	 * @return a cleaned string
	 */
	var __CLEAN = function( str ) {	
		/** - replaces new lines (then __UNESC will replace the placeholder)
		* other than doing it on the server
		*
		* - performs the win32 match first since it also has \n in addition to \r, best
		* to match the larger before the smaller
		*/
		str = str.replace(/\r\n/g, "~@"); // replaces win32 new lines
		str = str.replace(/\n/g, "~!"); // replaces unix/other new lines
		return str;
	};

	/**
	 * Receives the qucomm server response
	 * @return null
	 */
	var QuServerResponse = function( req ) {
		// replace abbrev. syntax with full syntax
		var response = __TRIM(__CLEAN(req.responseText));
		var quresponse = null;
	    QuComm.Util.doutput( "QuServerResponse: "+response );
		
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
		catch ( e ) 
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
	var parseQuResponse = function(quobj) {
		for( var qur in quobj )
		{		
			if ( qur.length != 0 )
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
				if (qutag || quid=="JS") switch ( quarr[0] )
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
	 * Outputs debug string to FireBug
	 * @return null
	 */
    this.doutput = function( str ) 
	{
	
		if (QuComm.DEBUG)
		{
			if ( console )
				console.info( str );
		} // end IF
	};
	
}; // end QuUtil class

// add the Utils to QuComm (singleton)
QuComm.Util = new QuUtil();

//})(); // end QuUtils scope

/**
 * Handles any qurpc errors (function)
 * @param string [msg] error message
 * @param object [request] the async request object
 */
QuComm.onError = null;

/**
 * Gets/Sets the debug state
 * @return true|false
 */
QuComm.DEBUG = true;
