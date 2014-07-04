define(['coreJS/adapt','extensions/adapt-search/js/adapt-search'],function(Adapt, searchObj) {
        var search = searchObj.search;
        var results = searchObj.results;
        describe('search(query)', function(){
            it('should return empty array when no search terms matched', function(){
                search('scotland');
                expect(results().length).to.equal(0);
            })
            
            it('should return no content matches when no space between search query words', function(){
                search('worldbrazil');
                expect(results().length).to.equal(0);
            })
            
            it('should return matches when multiple query words are matched', function(){
                search('italy,england');
                expect(results().length).to.be.above(0);
            })
            
            it('should return matches when the single query word is matched', function(){
                search('argentina');
                expect(results().length).to.be.above(0);
            })
            
            it('should return matches when at least one query word matched and there are others with no matches', function(){
                search('argentina scotland iceland');
                expect(results().length).to.be.above(0);
            })
            
            it('should not return more than the total number of blocks', function(){
                search('world cup brazil croatia spain argentina rio salvador germany italy england manaus mexico colombia uruguay belgium portugal france holland final');
                expect(results().length).to.not.be.above(Adapt.blocks.length);
            })
            
            it('should handle commas randomly placed within the search query', function(){
                search('brazil,spain, france , england ,world cup germany colombia');
                expect(results().length).to.be.above(0);
            })
            
            it('should handle a mixture of caps and lower case', function() {
                search('BraZil');
                expect(results().length).to.be.above(0);
            })
            
            it('should ignore any repeated keywords', function() {
                search('brazil spain brazil brazil');
                var firstSearchResults = results();
                search('brazil spain');
                expect(results()).to.eql(firstSearchResults);
            })
        })
    
});