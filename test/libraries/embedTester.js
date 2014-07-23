var embedTester = function() {};
embedTester.prototype.initialise = function (options, callback) {
	//create options in object;
	if (typeof options == "undefined") options = {};
	this.options = options;
	this.options.loadedunits = [];
	
	//redo document base to build folder and keep current base
	var parser = parseUri(location.href); 
	var testbase = parser.protocol+"://"+parser.authority+parser.directory;
	var url = "";
	if (typeof options.url !== "undefined") {
		url  = options.url;
	} else if (typeof parser.queryKey['src'] == "undefined") {
	    url = prompt("Enter a url to a working website:");
	} else {
	    url = parser.queryKey['src'];
	}
	var a = document.createElement("a");
	a.href = url;
	url = a.origin+a.pathname;
	if (url.substr(url.length-2) !== "/") url+="/";
	$("head").append($("<base>").attr("href",url));
	this.base = url; //build folder
	this.testbase = testbase; //test base folder

	var embedTesterHandle = this;
	for(var i = 0; i < this.options.units.length; i++) {
		item = this.options.units[i];
		item.url = embedTesterHandle.testbase + item.url;
	};

	if (typeof callback == "function") callback.call(this);
};

embedTester.prototype.render = function() {
	
	//build splitpane div elements
	var splitpane = $('<div class="split-pane"></div>');
	//create embeded website wrapper
    var embedwrapper = $('<div class="embedwrapper id="top-component">');
    //create mocha output wrapper
    var mochawrapper = $('<div class="mochawrapper id="bottom-component"></div>');
    //create unit test menus
    var testmenu = $("#testmenu").append($('<div><h6 style="display:inline;">Loaded units: <span id="testloadedunits"></span></h6> <button class="runtest" value="Rerun">Rerun</button></div>')).append($('<div><h6 style="font-size:.6em;">Available units: <span id="testloadunits"></span></h6></div>'));
	var testloadedunits = testmenu.find("#testloadedunits");
	var testloadunits = testmenu.find("#testloadunits");

	//move testcontainer into new mochawrapper
	mochawrapper.append($("#testcontainer"));
	
	//add buttons to menu for unit tests not set to start
	var spacer = "";
	for (var i = 0; i < this.options.units.length; i++) {
		if (this.options.units[i].runat == "start") {
			this.options.loadedunits.push(this.options.units[i]);
			testloadedunits.append(spacer+this.options.units[i].name);
			spacer = ", ";
			continue;
		}
		testloadunits.append($('<button class="runtest" id="' + this.options.units[i].url + '" value="' + this.options.units[i].name + '">' + this.options.units[i].name + '</button>'));
	}
	//remove load menu if no additional units to load
	if (this.options.loadedunits.length === this.options.units.length) {
		testloadunits.parent().remove();
	}

	//setup button clicks for rerun and units to load
	var embedTesterHandle = this;
	$(document).on("click","button.runtest", function() {
		var $this = $(this);
		var id = $this.attr("id");
		//if not rerun button
		if (typeof id !== "undefined") {
			//remove button on click
			$(this).remove();
			//if no more load buttons, remove load parent
			if ($("#testloadunits").children("button").length === 0 ) $("#testloadunits").parent().remove();
			//find unit test for clicked button
			var unit = _.findWhere(embedTesterHandle.options.units, {"url":id});
			//update loaded display
			$("#testloadedunits").append( (embedTesterHandle.options.loadedunits.length === 0 
				? ""
				: ", ") + unit.name);
			//update loaded array
			embedTesterHandle.options.loadedunits.push(unit);
		}
		//run tests
		embedTesterHandle.testRun();
	});

	//move remaining body items into embedwrapper
    $("body").children().each(function(index, item) {
        embedwrapper.append(item);
    });
    //move embedwrapper and mochawrapper into splitpane
    splitpane.append(embedwrapper).append(mochawrapper);
    //add only splitpane to body
    $("body").append(splitpane);

    //include testing components
    require(['require', 'expect', 'mocha'], function(require, expect, chai) {
        mocha.setup('bdd');
	    mocha.checkLeaks();
	    mocha.globals(['jQuery']);
	});

    var embedTesterHandle = this;
    //inject splitter script into new jquery
    yepnope.injectJs(this.testbase+"libraries/splitter.js", function() {
        //create splitter from divs and library
        $(".split-pane").splitter({
			type: "h", 
			sizeTop: true,	/* use height set in stylesheet */
			accessKey: "P",
			anchorToWindow: true
		});

        //resize defined divs on splitpane resize
		$(".split-pane").trigger("resize", [ window.innerHeight / 2 ]).on("resize", function() {
			if (typeof embedTesterHandle.options.resizeClasses !== "undefined") $(embedTesterHandle.options.resizeClasses).css("height", $(this.children[0]).css("height") );
		});

		//trigger testRun on loaded
		if (typeof embedTesterHandle.options.run == "undefined" || embedTesterHandle.options.run) {
			embedTesterHandle.testRun();
		}

	});
};

embedTester.prototype.testRun = function(){
	$("#mocha").html("");
    //load unit tests
	var startunits = _.uniq(_.pluck( this.options.loadedunits.concat(_.filter(this.options.units, function(item) { return (item.runat == "start"); }  )), "url" ));
    require(startunits, function(capitalize){
    	//run mocha test
        mocha.run();
    });

};

