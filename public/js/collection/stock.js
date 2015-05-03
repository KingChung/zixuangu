define(
    [
        'backbone',
        'model/stock'
    ]
    , function(Backbone, StockModel){
        
        return Backbone.Collection.extend({
        	url: '/api/stock/',
            model: StockModel
        });
    }
);