define(
    [
        'backbone',
        'underscore',
        'doT',
        'config',
    	'view/sidebar',
    	'view/content',
        'collection/stock',
        'collection/stock/instant',
    	'text!templates/main.html',
        'util/calculator',
        'util/notify',

        'notify'
    ]
    , function(Backbone, _, doT, Config, SidebarView, ContentView, StockCollection, InstantCollection, ViewTemplate, Calculator, Notify){
    	return function(){
    		var main = new Backbone.Layout({
	            template: doT.template(ViewTemplate),
                initialize: function(){
                    this.collection = new StockCollection();
                    this.collection.on('reset', this.initInterval, this);

                    // var model = new Backbone.Model({id: 'test', price: 10, name: '测试股', display_name: '测试股(000000)'});
                    // Calculator.register(model, 'price', {
                    //     count: 3,
                    //     interval: 6
                    // });

                    // var fre = [0.5, 0.6, 0.8, -0.7, -0.7, -0.1];
                    // for(var i = 0; i < 1; i++) {
                    //     fre = fre.concat(fre);
                    // }

                    // var test = function(){
                    //     var price = model.get('price'),
                    //         changePercent = fre.shift(),
                    //         newPrice = price + changePercent / 100 * price;
                    //     model.set('price', parseFloat(newPrice.toFixed(2)));
                    //     setTimeout(test, 1e3);
                    // };
                    // test();
                },
                beforeRender: function(){
                    this.setViews({
                        "#sidebar-wrapper": new SidebarView({collection: this.collection}),
                        "#page-content-wrapper": new ContentView({collection: this.collection})
                    });
                },
                afterRender: function(){
                    
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
                                setTimeout(_.partial(interval, context), Config.stock_refresh_rate);
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