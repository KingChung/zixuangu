define(
    [
        'backbone',
        'underscore',
        'util/calculator'
    ]
    , function(Backbone, _, Calculator){
        
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
                this.set('display_name', this.get('name') + "(" + this.get("symbol") + ")");
                var calculator = Calculator.register(this, 'current_price', this.get('setting'));
                this.on('change:setting', function(model, setting){
                    calculator.refresh(setting);
                });
            }
        });
    }
);