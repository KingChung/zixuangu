require([
    'jquery',
    'backbone', 
    'underscore',
    'doT', 
    'view/main',
    'bootstrap', 
    'layoutmanager'
    ],
    function($, Backbone, _, doT, Main) {

        var toString = ({}).toString;
        Backbone.Layout.configure({
            // Allow LayoutManager to augment Backbone.View.prototype.
            manage: true
        });

        Backbone.Model.prototype.param = function() {
            this._urlParams || (this._urlParams = {});
            var args = [].slice.call(arguments, 0);
            if(toString.call(args[0]) == '[object String]') {
                if( ! args[1]) {
                    return this._urlParams[args[0]];
                }
                this._urlParams[args[0]] = args[1];
            } else if(toString.call(args[0]) == '[object Object]') {
                this._urlParams = _.extend(this._urlParams, args[0]);
            }
        };

        var modelFetch = Backbone.Model.prototype.fetch;
        Backbone.Model.prototype.fetch = function() {
            var args = [].slice.call(arguments, 0);
            var params = args[0], data;
            if(params) {
                data = args[0].data || {};
                if(toString.call(data) == '[object String]') {
                    data = data + '&' + _.map(this._urlParams, function(v,k){
                        return k + '=' + v;
                    }).join('&');
                } else if(toString.call(data) == '[object Object]') {
                    data = _.extend({}, data, this._urlParams);
                } else {
                    data = this._urlParams;
                }
                params.data = data;
            } else {
                params = {data: this._urlParams};
            }
            args[0] = params;
            return modelFetch.apply(this, args);
        };

        Main();
    });
