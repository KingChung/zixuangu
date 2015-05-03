define(
    [
        'backbone'
    ]
    , function(Backbone){
        
        return Backbone.Model.extend({
            urlRoot: '/api/stock/',
        	defaults: {
        		"name": "",
        		"symbol": "",
                "type": ""
        	},
            initialize: function(){

            }
        });
    }
);