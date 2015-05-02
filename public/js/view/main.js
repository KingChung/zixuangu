define(
    [
        'backbone',
        'doT',
    	'view/sidebar',
    	'view/content',
    	'text!templates/main.html'
    ]
    , function(Backbone, doT, SidebarView, ContentView, ViewTemplate){
    	return function(){
    		var main = new Backbone.Layout({
	            template: doT.template(ViewTemplate),
	            views: {
	                "#sidebar-wrapper": new SidebarView(),
	                "#page-content-wrapper": new ContentView()
	            }
	        });

	        main.$el.appendTo($('#wrapper'));
	        main.render();
    	}
    }
);