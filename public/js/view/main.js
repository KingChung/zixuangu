define(
    [
        'backbone',
        'doT',
    	'view/sidebar',
    	'view/content',
        'collection/stock',
    	'text!templates/main.html'
    ]
    , function(Backbone, doT, SidebarView, ContentView, StockCollection, ViewTemplate){
    	return function(){
    		var main = new Backbone.Layout({
	            template: doT.template(ViewTemplate),
                initialize: function(){
                    this.collection = new StockCollection();
                },
                beforeRender: function(){
                    this.setViews({
                        "#sidebar-wrapper": new SidebarView({collection: this.collection}),
                        "#page-content-wrapper": new ContentView({collection: this.collection})
                    });
                }
	        });

	        main.$el.appendTo($('#wrapper'));
	        main.render();
    	}
    }
);