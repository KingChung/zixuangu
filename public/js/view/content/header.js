define(
    [
        'backbone',
        'underscore',
        'doT',
        'util/notify',
        'model/stock',
        'text!templates/content/header.html'
    ]
    , function(Backbone, _, doT, Notify, StockModel, ViewTemplate){

        return Backbone.View.extend({
            tagName: 'h1',
            className: 'stock-title',
            template: doT.template(ViewTemplate),
            initialize: function(){
                var self = this;
                this.model = this.model || new StockModel();
            },
            serialize: function() {
                return this.model.toJSON();
            },
            events: {
                'click .remove_stock': 'removeStock',
                'submit #setting-form': 'updateStockSetting'
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
            },
            updateStockSetting: function(e){
                var data = {},
                    $target = $(e.currentTarget);
                _.each($target.serializeArray(), function(pair){
                    data[pair.name] = pair.value;
                });
                data.enable = (data.enable == "on");
                this.model.save({setting: data}, {
                    wait: true,
                    success: function(){
                        var notification = Notify.notify('提醒设置', '保存成功!');
                        setTimeout(function(){notification.close();}, 2e3);
                        $('#notify_setting').dropdown('toggle');
                    }
                });
                return false;
            }
        });
    }
);