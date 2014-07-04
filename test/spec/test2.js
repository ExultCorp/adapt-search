define(['coreJS/adapt','extensions/adapt-search/js/adapt-search'],function(Adapt, searchObj) {
	var search = searchObj.search;
    var results = searchObj.results;
    describe('drawer test', function(){
        it('drawer show test', function(){
            //search('scotland');
            $('[data-event="toggleDrawer"]').trigger("click");
            expect(parseInt($('.drawer').css("right"))).to.equal(0);
        });
   });
});