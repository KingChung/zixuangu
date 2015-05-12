define(
    [
        'backbone',
        'doT',
        'amcharts.serial',
        'model/stock',
        'model/stock/instant',
        'text!templates/content.html',
        'text!templates/content/detail.html',
        'text!templates/content/timeline.html',

        'amcharts.themes.dark'
    ],
    function(Backbone, doT, amSerial, StockModel, StockInstantModel, ViewTemplate, DetailViewTemplate, TimelineViewTemplate) {
        
        var DetailView = Backbone.View.extend({
            template: doT.template(DetailViewTemplate),
            initialize: function(){
                this.model = this.model || new StockModel();
                this.listenTo(this.model, 'change', this.render, this);
            },
            serialize: function() {
                return this.model.toJSON();
            },
            events: {
                'click .remove_stock': 'removeStock'
            },
            removeStock: function(e){
                var self = this;
                var $target = $(e.currentTarget);
                this.model.destroy({
                    success: function(model, response){
                        model.collection && model.collection.remove(model);
                    }
                });
                return false;
            }
        });

        var TimelineView = Backbone.View.extend({
            className: 'stock-time-line',
            template: doT.template(TimelineViewTemplate),
            initialize: function(){
                var code = this.model.get('type') + this.model.get('symbol');
                this.source = "http://image.sinajs.cn/newchart/min/n/" + code.toLowerCase() + '.gif';
                this.interval();
            },
            serialize: function() {
                return {source: this.source};
            },
            interval: function(){
                this.$('.time_line').attr('src', this.source + '?t=' + new Date());
                setTimeout(_.bind(this.interval, this), 60e3);
            }
        });

        return Backbone.View.extend({
            id: 'main-stock',
            template: doT.template(ViewTemplate),
            initialize: function(options) {
                var self = this;
                if (!options.collection) throw Error('Collection can not be blank.');
                this.collection = options.collection;
                this.collection.on('remove', function() {
                    var last = self.collection.last();
                    if(last) {
                        self.setContent(last);
                    }
                });
                this.collection.on('show', this.setContent, this);
            },
            setContent: function(data) {
                var model = this.collection.get(data.id);
                if(model) {
                    if(this.view) this.view.remove();
                    var view = new DetailView({model: model});
                    this.$('#block_content_main').html(view.el);
                    view.render();
                    this.view = view;

                    var timeline = new TimelineView({model: model});
                    this.$('#block_content_main').append(timeline.el);
                    timeline.render();
                }
            }
        });
    }
);
