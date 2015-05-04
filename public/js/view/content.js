define(
    [
        'backbone',
        'doT',
        'model/stock/instant',
        'text!templates/content.html'
    ]
    , function(Backbone, doT, StockInstantModel, ViewTemplate){
        return Backbone.View.extend({
            id: 'main-stock',
            template: doT.template(ViewTemplate),
            initialize: function(options){
                var self = this;
                if(!options.collection) throw Error('Collection can not be blank.');
                this.collection = options.collection; 
                this.collection.on('reset', function(collection){
                    var first = collection.first();
                    if(first) {
                        self.setContent(first.get('symbol'), first.get('type'));
                    }
                });
                this.collection.on('show', this.setContent, this);
                this.model = new Backbone.Model();
                this.model.on('change', this.render, this);

                this.timeLineSource = '';
            },
            serialize: function() {
                return _.extend(this.model.toJSON(), {time_line_source: this.timeLineSource});
            },
            afterRender: function(){
                var self = this;
                this.tlInterval && clearTimeout(this.tlInterval);
                var interval = function(){
                    self.tlInterval = setTimeout(function(){
                        self.refreshTimeline(interval);
                    }, 5e3);
                };
                interval();
            },
            refreshTimeline: function(callback) {
                this.$('.time_line').attr('src', this.timeLineSource + '?t=' + new Date().getTime());
                callback && callback();
            },
            setContent: function(symbol, type) {
                var self = this;
                var instant = new StockInstantModel();
                instant.param({symbol: symbol, type: type});
                instant.fetch({
                    success: function(model, response){
                        self.model.set(_.extend(response.data, {symbol: symbol, type: type}));
                        self.timeLineSource = 'http://image.sinajs.cn/newchart/min/n/' + (type + symbol).toLowerCase() + '.gif';
                    }
                });
            }
        });
    }
);