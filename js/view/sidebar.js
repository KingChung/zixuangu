define(
    [
        'backbone',
        'doT',
        'text!templates/sidebar.html'
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