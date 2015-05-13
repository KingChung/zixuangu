define(
    [
        'backbone',
        'underscore',
        'doT',
        'model/stock',
        'text!templates/content/detail.html'
    ]
    , function(Backbone, _, doT, StockModel, ViewTemplate){

        return Backbone.View.extend({
            template: doT.template(ViewTemplate),
            initialize: function(){
                this.model = this.model || new StockModel();
                this.listenTo(this.model, 'change', this.render, this);
            },
            serialize: function() {
                return this.model.toJSON();
            }
        });
    }
);