define(
    [
        'backbone'
    ]
    , function(Backbone){
        
        return Backbone.Model.extend({
        	urlRoot: '/api/stock/search',
            initialize: function(){

            }
        });
    }
);