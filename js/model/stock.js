define(
    [
        'backbone'
    ]
    , function(Backbone){
        
        return Backbone.Model.extend({
        	defaults: {
        		"code": "",
        		"price": ""
        	},
            initialize: function(){

            }
        });
    }
);