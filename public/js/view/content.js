define(
    [
        'backbone',
        'doT',
        'text!templates/content.html'
    ]
    , function(Backbone, doT, ViewTemplate){
        return Backbone.View.extend({
            template: doT.template(ViewTemplate),
            initialize: function(){

            },
            events: {

            },
            serialize: function() {
                
            }
        });
    }
);