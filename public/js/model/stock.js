define(
    [
        'backbone'
    ]
    , function(Backbone){
        
        return Backbone.Model.extend({
            urlRoot: '/api/stock',
        	defaults: {
        		"code": "",
        		"price": ""
        	},
            initialize: function(){

            }
        });
    }
);