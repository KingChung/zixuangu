define(
    [
        'backbone',
        'doT',
        'view/content/header',
        'view/content/detail',
        'view/content/timeline',
        'text!templates/content.html',
    ],
    function(Backbone, doT, HeaderView, DetailView, TimelineView, ViewTemplate) {

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

                    var header = new HeaderView({model: model});
                    this.$('#block_content_main').prepend(header.el);
                    header.render();
                }
            }
        });
    }
);
