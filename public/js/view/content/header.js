define(
    [
        'backbone',
        'underscore',
        'doT',
        'util/notify',
        'model/stock',
        'model/stock/setting',
        'text!templates/content/header.html'
    ]
    , function(Backbone, _, doT, Notify, StockModel, StockSettingModel, ViewTemplate){

        return Backbone.View.extend({
            tagName: 'h1',
            className: 'stock-title',
            template: doT.template(ViewTemplate),
            initialize: function(){
                var self = this;
                this.model = this.model || new StockModel();
                // this.listenTo(this.model, 'change:name', this.render, this);
                this.setting = new StockSettingModel();
                this.setting.param({stock_id: this.model.get('id')});
                this.setting.fetch({
                    success: function(model, res){
                        self.render();
                    }
                });
            },
            serialize: function() {
                return _.extend(this.setting.toJSON(), {
                    name: this.model.get('name'),
                    symbol: this.model.get('symbol')
                });
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
                data.stock_id = this.model.get('id');
                data.enable = (data.enable == "on");
                this.setting.save(data, {
                    success: function(){
                        Notify.notify('提醒设置', '保存成功!');
                        $('#notify_setting').dropdown('toggle');
                    }
                });
                return false;
            }
        });
    }
);