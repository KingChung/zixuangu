define(
    [
        'backbone',
        'underscore',
        'util/notify',
        'store'
    ]
    , function(Backbone, _, Notify, Store){
        
        return Backbone.Model.extend({
            urlRoot: '/api/stock/',
        	defaults: {
        		"name": "",
        		"symbol": "",
                "type": ""
        	},
            initialize: function(){
                var self = this;
                var count = 1;
                this.on('change:current_price', function(model, price){
                    // if(count != 4) {
                    //     return count++;
                    // }

                    var points = Store.get(model.get('id')) || [];
                    var lastPoint = points[points.length - 1];
                    var currentPoint = + new Date();
                    if(lastPoint && (currentPoint - lastPoint) > 24 * 60 * 60 * 1e3) {
                        points = [];
                    }

                    points.push({price: price, time: +new Date()});

                    if(points.length > 6) {
                        points = points.slice(1);
                    }

                    this.calculate(_.map(points, function(p){
                        return p.price;
                    }));

                    Store.set(model.get('id'), points);
                    // count = 1;
                }, this);
            },
            notify: function(points){
                Notify.notify(this.get('name') + "(" + this.get("symbol") + ")", "报价:" + points.toString());
            },
            calculate: function(points){
                points = _.map(points || [], function(p){
                    return parseFloat(p);
                });
                if(points.length) {
                    var p1 = points[0], p2 = points[1], p3 = points[2], p4 = points[3], p5 = points[4], p6 = points[5];

                    // if(this.get('symbol') == '600019') {
                    //     this.notify(points);
                    // }

                    //先降后升
                    if(
                        p1 > p2
                        && p3 > p2
                        && p3 && ((p4-p3) / p3) > 0.005
                        && p4 && ((p5-p4) / p4) > 0.005
                        && p5 && ((p6-p5) / p6) > 0.005
                    ) {
                        console.log('alert', p1, p2, p3, p4, p5, p6)
                    }

                    //先升后降
                    if(
                        p1 < p2
                        && p3 < p2
                        && p3 && ((p3-p4) / p3) > 0.005
                        && p4 && ((p4-p5) / p4) > 0.005
                        && p5 && ((p5-p6) / p6) > 0.005
                    ) {
                        console.log('alert', p1, p2, p3, p4, p5, p6)
                    }
                }
            },
            getHistory: function(){

            }
        });
    }
);