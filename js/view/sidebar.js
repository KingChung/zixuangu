define(
    [
        'backbone',
        'doT',
        'model/stock',
        'text!templates/sidebar.html'
    ]
    , function(Backbone, doT, StockModel, ViewTemplate){
        return Backbone.View.extend({
            template: doT.template(ViewTemplate),
            initialize: function(){
            	
            },
            events: {
                'submit #search_form': 'search'
            },
            search: function(){
                var s = new StockModel({code: $.trim($('#search_stock').val())});
                s.save();
                return false;
            },
            serialize: function() {
                
            }
        });
    }
);