define(
    [
        'backbone',
        'store'
    ]
    , function(Backbone, Store){
        
        return Backbone.Model.extend({
        	urlRoot: '/api/stock/instant',
            defaults: {
                id: '',
                name: '',
                opening_price: '',
                last_price: '',
                current_price: '',
                change_price: '',
                change_percent: '',
                day_s_high: '',
                day_s_low: '',
                date: '',
                time: ''
            },
            initialize: function(){
                var self = this;
                // this.on('change:symbol', function(model, id){
                //     var points = Store.get(id) || [];
                //     var lastPoint = points[points.length - 1];
                //     var currentPoint = + new Date();
                //     if(lastPoint && (currentPoint - lastPoint) > 24 * 60 * 60 * 1e3) {
                //         points = [];
                //     }

                //     self.on('change:current_price', function(model, price){
                //         console.log('model change', model.get('id'), price);
                //         points.push({price: price, time: +new Date()});
                //         Store.set(id, points);
                //     });
                // });
            }
        });
    }
);