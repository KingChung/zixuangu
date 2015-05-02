define(
    [
        'backbone',
        'doT',
        'model/stock',
        'model/stock_search',
        'collection/stock',
        'text!templates/sidebar.html',
        'text!templates/sidebar/stock.html',
        'jqueryUI'
    ]
    , function(Backbone, doT, StockModel, StockSearchModel, StockCollection, ViewTemplate, ItemViewTemplate){

        var ItemView = Backbone.View.extend({
            tagName: 'li',
            className: 'item',
            attributes: {
                'data-type': 'item'
            },
            template: doT.template(ItemViewTemplate),
            serialize: function(){
                return this.model.toJSON();
            }
        });

        return Backbone.View.extend({
            template: doT.template(ViewTemplate),
            initialize: function(){
            	this.collection = new StockCollection();
                this.collection.on('reset', this.renderList);
            },
            views: {

            },
            events: {
                'submit #search_form': 'preventDefault'
            },
            preventDefault: function(){
                return false;
            },
            renderList: function(){
                this.$('[data-type="item"]').remove();
                this.collection.each(function(s){

                });
            },
            afterRender: function(){
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
            }
        });
    }
);