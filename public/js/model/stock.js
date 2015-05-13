define(
    [
        'backbone',
        'underscore',
        'util/calculator',
        'store'
    ]
    , function(Backbone, _, Calculator, Store){
        
        return Backbone.Model.extend({
            urlRoot: '/api/stock/',
        	defaults: {
        		"name": "",
        		"symbol": "",
                "type": "",
                "setting": {
                    "enable": true,
                    "count": 6,
                    "interval": 20, //second
                    "range_percent": 0.05
                }
        	},
            initialize: function(){
                var self = this;
                this.on('change:current_price', function(model, price){
                    this.calculate(this.updatePoint(price));
                }, this);
            },
            updatePoint: function(price){
                var points = Store.get(this.get('id')) || [];
                var lastPoint = points[points.length - 1];

                //Clear store if last point's date is not equal current date
                var now = new Date(),
                    lastDate = lastPoint && new Date(lastPoint);
                if(now.getDate() == lastDate.getDate()) points = [];

                points.push({price: price, time: now.getTime()});
                if(points.length > 6) points = points.slice(1);

                Store.set(this.get('id'), points);
                return points;
            },
            calculate: function(points){
                Calculator.calculate(points, this.getOptions());
            },
            getOptions: function(){

            }
        });
    }
);