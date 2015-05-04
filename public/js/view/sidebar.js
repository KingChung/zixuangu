define(
    [
        'backbone',
        'doT',
        'model/stock',
        'model/stock/search',
        'text!templates/sidebar.html',
        'text!templates/sidebar/stock.html',
        'jqueryUI'
    ]
    , function(Backbone, doT, StockModel, StockSearchModel, ViewTemplate, ItemViewTemplate){

        var ItemView = Backbone.View.extend({
            tagName: 'li',
            className: 'item',
            attributes: {
                'data-type': 'item'
            },
            template: doT.template(ItemViewTemplate),
            initialize: function() {
                
            },
            serialize: function(){
                return this.model.toJSON();
            },
            afterRender: function(){
                // console.log(this.model.toJSON('id'))
                this.$el.attr('data-id', this.model.get('id'));
            }
        });

        return Backbone.View.extend({
            template: doT.template(ViewTemplate),
            initialize: function(options){
                if(!options.collection) throw Error('Collection can not be blank.');
                this.collection = options.collection; 
                this.collection.on('reset', this.renderList, this);
                this.collection.on('add', this.appendList, this);

                this.$list = null;
            },
            events: {
                'submit #search_form': 'preventDefault',
                'click [data-type="item"]': 'showMain'
            },
            beforeRender: function(){
                this.collection.fetch({reset: true});
            },
            afterRender: function(){
                var self = this;
                this.$list = this.$('[data-type="list"]');

                var $input = $('#search_stock');
                $input.autocomplete({
                    source: function(req, res){
                        var search = new StockSearchModel();
                        search.param('keyword', $.trim(req.term));
                        search.fetch({
                            success: function(model, response){
                                if(response.result) {
                                    res(response.data);
                                }
                            }
                        });
                    },
                    select: function(e, ui){
                        var model = new StockModel();
                        model.save({symbol: ui.item.symbol, type: ui.item.type}, {
                            success: function(model, response){
                                self.collection.add(model);
                            }
                        });
                    }
                }).data("ui-autocomplete")._renderItem = function(ul, item){
                    item.value = item.symbol+ '.' + 'SH'; 
                    return $('<li>')
                        .attr('data-value', item.value)
                        .append(item.name + '(' + item.symbol + ')')
                        .appendTo(ul);
                };
            },
            preventDefault: function(){
                return false;
            },
            renderList: function(collection){
                this.$('[data-type="item"]').remove();
                this.collection.each(_.bind(this.appendList, this));
            },
            appendList: function(model){
                var itemView = new ItemView({model: model});
                itemView.$el.appendTo(this.$list);
                itemView.render();
            },
            showMain: function(e){
                var model = this.collection.get($(e.currentTarget).attr('data-id'));
                this.collection.trigger('show', model.get('symbol'), model.get('type'));
            }
        });
    }
);