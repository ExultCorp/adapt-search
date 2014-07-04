var adaptTester = function(options, callback) {
    this.initialise(options, callback);
};
adaptTester.prototype = new embedTester();
adaptTester.prototype.initialise = function (options, callback){
    options.resizeClasses = ".adaptwrapper .drawer";
    embedTester.prototype.initialise.call(this, options, callback);
    this.loadAdapt();
};
adaptTester.prototype.loadAdapt = function () {
    //require adapt, modernizr, test spec sheet, expect and mocha
    var require = {
        baseUrl: this.base,
        paths: {
            adapt: 'adapt/js/adapt.min.js',
            spec: this.testbase+'spec',
            expect: this.testbase+'libraries/expect',
            mocha: this.testbase+'libraries/mocha'
        }
    };
    //export to window variable so that require module picks up config
    window.require = require;

    //keep link clicks within top pane
    $(document).on("click","a", function(event) {
        event.preventDefault();
        event.stopPropagation();
        if (this.hash == "") return;
        location.hash = this.hash;
    });


    var embedTesterHandle = this;
    Modernizr.load([
        {
            test: window.JSON,
            nope: this.base+'libraries/json2.js'
        },
        {
            test: window.console == undefined,
            yep: this.base+'libraries/consoles.js'
        },
        {
            test: Modernizr.video || Modernizr.audio,
            nope: this.base+'libraries/swfObject.js',
            complete: function() {
                //load adaptcss
                yepnope.injectCss("adapt/css/adapt.css", function() {
                    $("html").css("overflow-y","hidden");
                });

                //load require and adapt
                yepnope.injectJs("libraries/require.js", function() {
                        //wait for 1 second for adapt to load
                        setTimeout(function() {
                            embedTesterHandle.render();
                        },1000);
                    }, {
                        type:"text/javascript",
                        language:"javascript",
                        "data-main":embedTesterHandle.base+"adapt/js/adapt.min.js"
                }, 5000);
            }
        }
    ]);
};