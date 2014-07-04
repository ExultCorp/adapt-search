adapt-unittest
==============
  
Kit for testing builds / components / extensions / menus  
  
###Usage  
  
1. Either include in your adapt_framework environment as 'test' folder or include in an extension/component/menu folder as a 'test' folder.  
  
2. Edit the config.js url as a relative path to your 'build' folder.  
  
	url: "../build"     is for the adapt_framework environment test folder  
  
	url: "../../../../build"   is for a component test folder  
  
	undefined		is to force the test framework to ask you for a valid build folder url  
  
3. Create your unit tests in the spec folder and include them in the config.js file:  
  
	units : [  
		{  
			"name": "displayname1",  
			"url": "spec/unit1.js",  
			"runat": "start" 	// will run when test framework starts.  
		},  
		{  
			"name": "displayname2",  
			"url": "spec/unit2.js",  
			"runat": "click"	// will run only when loaded  
		}  
	]  
  
4. Navigate to index.html in your browser.  
  
  
###Todo  
  
1. Check if adapt_framework 'build' url is valid  
2. Check if unit test urls are valid  