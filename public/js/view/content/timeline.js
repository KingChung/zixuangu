define(
    [
        'backbone',
        'underscore',
        'doT',
        'text!templates/content/timeline.html'
    ]
    , function(Backbone, _, doT, ViewTemplate){

        return Backbone.View.extend({
            className: 'stock-time-line',
            template: doT.template(ViewTemplate),
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
    }
);