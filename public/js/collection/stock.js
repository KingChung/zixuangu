define(
    [
        'backbone',
        'model/stock'
    ]
    , function(Backbone, StockModel){
        
        return Backbone.Collection.extend({
            model: StockModel
        });
    }
);