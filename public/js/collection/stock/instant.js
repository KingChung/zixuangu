define(
    [
        'backbone',
        'model/stock/instant'
    ]
    , function(Backbone, StockModel){
        
        return Backbone.Collection.extend({
        	url: '/api/stock/instant',
            model: StockModel
        });
    }
);