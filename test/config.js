 new adaptTester({
    run : true,
    url : "../../../adapt_framework/builds/m05",
    //undefined :               for test to ask which build url to use, popup
    //"../build" : 				for	build unit tests
    //"../../../../build" : 	for component/extension/menu unit tests
    units : [
        {
        	"name" : "search",
        	"url" : "spec/test.js",
        	"runat" : "start"
        }
    ]
});