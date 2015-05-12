define(
    [
        'backbone',
        'underscore',
        'doT',
    	'view/sidebar',
    	'view/content',
        'collection/stock',
        'collection/stock/instant',
    	'text!templates/main.html',

        'notify'
    ]
    , function(Backbone, _, doT, SidebarView, ContentView, StockCollection, InstantCollection, ViewTemplate){
    	return function(){
    		var main = new Backbone.Layout({
	            template: doT.template(ViewTemplate),
                initialize: function(){
                    this.collection = new StockCollection();
                    this.collection.on('reset', this.initInterval, this);
                },
                beforeRender: function(){
                    this.setViews({
                        "#sidebar-wrapper": new SidebarView({collection: this.collection}),
                        "#page-content-wrapper": new ContentView({collection: this.collection})
                    });
                },
                initInterval: function(){
                    var interval = function(context){
                        var collection = new InstantCollection();
                        collection.param({codes: context.collection.map(function(m){
                            return m.get('type') + m.get('symbol');
                        }).join(',')});
                        collection.fetch({
                            success: function(collection, res){
                                context.collection.each(function(m, k){
                                    res[k] && m.set(res[k]);
                                });
                            },
                            complete: function(){
                                setTimeout(_.partial(interval, context), 10e3);
                            }
                        });
                    };
                    interval(this);
                }
	        });

	        main.$el.appendTo($('#wrapper'));
	        main.render();

            if(notify.PERMISSION_DEFAULT == notify.permissionLevel()) {
                notify.requestPermission(function(){
                    notify.config({pageVisibility: true});
                });
            }
    	};
    }
);