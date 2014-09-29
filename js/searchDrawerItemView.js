define(function(require) {

    var Backbone = require('backbone');
    var Adapt = require('coreJS/adapt');

    var SearchDrawerItemView = Backbone.View.extend({

        className: 'drawer-item-search',

        initialize: function() {
            this.listenTo(Adapt, 'drawer:empty', this.remove);
            this.render();
        },

        events: {
            'click .start-search':'search',
            'keydown .search-box':'checkEnter'
        },

        render: function() {
            var data = this.model.toJSON();
           
            var template = Handlebars.templates['searchBox']
            $(this.el).html(template(data));

            return this;
        },

        search: function(event) {
            if(event) event.preventDefault();
            var searchVal = $(".search-box").val();
            if(searchVal === "") {
                return;
            }
            Adapt.trigger("search:filterTerms", searchVal);
        },

        checkEnter: function(event) {
            if (event.keyCode === 13) {
                this.search();    
            }    
        }

    });

    return SearchDrawerItemView;
})