define(
    [
        'backbone',
        'underscore',
        'store'
    ]
    , function(Backbone, _, Store){
        
        return Backbone.Model.extend({
        	defaults: {
                "id": "",
        		"symbol": "",
                "points": []
        	},
            save: function(data, options){
                options = options || {};
                this.set(data || {}, {silent: true});
                Store.set(this.get('id'), this.toJSON());
                if(_.isFunction(options.success)) {
                    options.success(this, data);
                }
                return this;
            },
            fetch: function(options){
                this.set(Store.get(this.get('id')) || {}, {silent: true});
                _.each(options, function(action){
                    if(_.isFunction(action)) action(this);
                }, this);
            }
        });
    }
);