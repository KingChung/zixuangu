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

        var modelParse = Backbone.Model.prototype.parse;
        Backbone.Model.prototype.parse = function(response, options){
            var _response = {};
            if(response.result && response.data) {
                _response = _.extend({}, _.omit(response.data, '_id'), {
                    id: response.data._id
                });
            } else {
                _response = _.extend({}, _.omit(response, '_id'), {
                    id: response._id
                });
            }
            return modelParse.call(this, _response, options);
        };

        var modelSave = Backbone.Model.prototype.save;
        Backbone.Model.prototype.save = function(key, val, options) {
            var attrs, method, xhr, attributes = this.attributes;

            // Handle both `"key", value` and `{key: value}` -style arguments.
            if (key == null || typeof key === 'object') {
                attrs = key;
                options = val;
            } else {
                (attrs = {})[key] = val;
            }

            options = _.extend({validate: true}, options);

            // If we're not waiting and attributes exist, save acts as
            // `set(attr).save(null, opts)` with validation. Otherwise, check if
            // the model will be valid when the attributes, if any, are set.
            if (attrs && !options.wait) {
                if (!this.set(attrs, options)) return false;
            } else {
                if (!this._validate(attrs, options)) return false;
            }

            // Set temporary attributes if `{wait: true}`.
            if (attrs && options.wait) {
                this.attributes = _.extend({}, attributes, attrs);
            }

            // After a successful server-side save, the client is (optionally)
            // updated with the server-side state.
            if (options.parse === void 0) options.parse = true;
            var model = this;
            var success = options.success;
            options.success = function(resp) {
                if(resp.result) {
                    // Ensure attributes are restored during synchronous saves.
                    model.attributes = attributes;
                    var serverAttrs = model.parse(resp.data, options);
                    if (options.wait) serverAttrs = _.extend(attrs || {}, serverAttrs);
                    if (_.isObject(serverAttrs) && !model.set(serverAttrs, options)) {
                      return false;
                    }
                    if (success) success(model, resp.data, options);
                    model.trigger('sync', model, resp.data, options);
                } else {
                    model.trigger('error', model, resp.message, options);
                }
            };
            wrapError(this, options);

            method = this.isNew() ? 'create' : (options.patch ? 'patch' : 'update');
            if (method === 'patch') options.attrs = attrs;
            xhr = this.sync(method, this, options);

            // Restore attributes.
            if (attrs && options.wait) this.attributes = attributes;

            return xhr;
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

        var collectionFetch = Backbone.Collection.prototype.fetch;
        Backbone.Collection.prototype.fetch = function(options) {
            options = options ? _.clone(options) : {};
            if (options.parse === void 0) options.parse = true;
            var success = options.success;
            var collection = this;
            options.success = function(resp) {
                var data = resp.data || [];
                if(resp.result) {
                    var method = options.reset ? 'reset' : 'set';
                    collection[method](resp.data, options);
                    if (success) success(collection, resp.data, options);
                    collection.trigger('sync', collection, resp.data, options);
                } else {
                    collection.trigger('error', collection, resp.message, options);
                }
            };
            wrapError(this, options);
            return this.sync('read', this, options);
        };

        // Wrap an optional error callback with a fallback error event.
        var wrapError = function(model, options) {
            var error = options.error;
            options.error = function(resp) {
                if (error) error(model, resp, options);
                model.trigger('error', model, resp, options);
            };
        };

        Main();
    });
