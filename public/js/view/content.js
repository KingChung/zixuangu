define(
    [
        'backbone',
        'doT',
        'amcharts.serial',
        'model/stock',
        'model/stock/instant',
        'text!templates/content.html',

        'amcharts.themes.dark'
    ],
    function(Backbone, doT, amSerial, StockModel, StockInstantModel, ViewTemplate) {
        return Backbone.View.extend({
            id: 'main-stock',
            template: doT.template(ViewTemplate),
            initialize: function(options) {
                var self = this;
                if (!options.collection) throw Error('Collection can not be blank.');
                this.collection = options.collection;
                this.collection.on('reset remove', function() {
                    var first = self.collection.first();
                    if (first) {
                        self.setContent(first.toJSON());
                    }
                });
                this.collection.on('show', this.setContent, this);
                this.model = new StockModel();
                this.model.on('change', this.render, this);

                this.timeLineSource = '';
            },
            events: {
                'click .remove_stock': 'removeStock'
            },
            serialize: function() {
                return _.extend(this.model.toJSON(), {
                    time_line_source: this.timeLineSource
                });
            },
            afterRender: function() {
                var self = this;
                // this.tlInterval && clearTimeout(this.tlInterval);
                // var interval = function(){
                //     self.tlInterval = setTimeout(function(){
                //         self.refreshTimeline(interval);
                //     }, 5e3);
                // };
                // interval();

                var chart = amSerial.makeChart("chartdiv", {
                    "type": "serial",
                    "theme": "dark",
                    "marginRight": 80,
                    "autoMarginOffset": 20,
                    "pathToImages": "http://www.amcharts.com/lib/3/images/",
                    "valueAxes": [{
                        "id": "v1",
                        "axisAlpha": 0,
                        "position": "left"
                    }],
                    "balloon": {
                        "borderThickness": 1,
                        "shadowAlpha": 0
                    },
                    "graphs": [{
                        "id": "g1",
                        "bullet": "round",
                        "bulletBorderAlpha": 1,
                        "bulletColor": "#FFFFFF",
                        "bulletSize": 5,
                        "hideBulletsCount": 50,
                        "lineThickness": 2,
                        "title": "red line",
                        "useLineColorForBulletBorder": true,
                        "valueField": "value",
                        "balloonText": "<div style='margin:5px; font-size:19px;'><span style='font-size:13px;'>[[category]]</span><br>[[value]]</div>"
                    }],
                    "chartScrollbar": {
                        "graph": "g1",
                        "scrollbarHeight": 80,
                        "backgroundAlpha": 0,
                        "selectedBackgroundAlpha": 0.1,
                        "selectedBackgroundColor": "#888888",
                        "graphFillAlpha": 0,
                        "graphLineAlpha": 0.5,
                        "selectedGraphFillAlpha": 0,
                        "selectedGraphLineAlpha": 1,
                        "autoGridCount": true,
                        "color": "#AAAAAA"
                    },
                    "chartCursor": {
                        "pan": true,
                        "valueLineEnabled": true,
                        "valueLineBalloonEnabled": true,
                        "cursorAlpha": 0,
                        "valueLineAlpha": 0.2
                    },
                    "categoryField": "time",
                    "categoryAxis": {
                        "parseDates": true,
                        "minPeriod": 'mm',
                        "dashLength": 1,
                        "minorGridEnabled": true,
                        "position": "bottom",
                        "autoGriddCount": false,
                        "gridCount": 9
                    },
                    "export": {
                        "enabled": true,
                        "libs": {
                            "path": "http://www.amcharts.com/lib/3/plugins/export/libs/"
                        }
                    },
                    // "dataDateFormat": "hh:mm",
                    "dataProvider": [{
                        "time": new Date(2015, 5, 1, 9, 30),
                        "value": 13
                    }, {
                        "time": new Date(2015, 5, 1, 9, 31),
                        "value": 15
                    }, {
                        "time": new Date(2015, 5, 1, 9, 32),
                        "value": 9
                    }, {
                        "time": new Date(2015, 5, 1, 10, 0),
                        "value": 11
                    }, {
                        "time": new Date(2015, 5, 1, 10, 30),
                        "value": 11
                    }, {
                        "time": new Date(2015, 5, 1, 11, 0),
                        "value": 11
                    }, {
                        "time": new Date(2015, 5, 1, 11, 30),
                        "value": 11
                    }, {
                        "time": new Date(2015, 5, 1, 13, 30),
                        "value": 11
                    }, {
                        "time": new Date(2015, 5, 1, 14, 0),
                        "value": 11
                    }, {
                        "time": new Date(2015, 5, 1, 14, 30),
                        "value": 11
                    }, {
                        "time": new Date(2015, 5, 1, 15, 0),
                        "value": 11
                    }]
                });

                chart.addListener("rendered", zoomChart);

                zoomChart();

                function zoomChart() {
                    chart.zoomToIndexes(chart.dataProvider.length - 40, chart.dataProvider.length - 1);
                }
            },
            removeStock: function(e){
                var self = this;
                var $target = $(e.currentTarget);
                this.model.destroy({
                    success: function(model, response){
                        self.collection.remove(self.collection.get(model.get('id')));
                    }
                });
                return false;
            },
            refreshTimeline: function(callback) {
                this.$('.time_line').attr('src', this.timeLineSource + '?t=' + new Date().getTime());
                callback && callback();
            },
            setContent: function(data) {
                var self = this;
                var instant = new StockInstantModel();
                instant.param({
                    symbol: data.symbol,
                    type: data.type
                });
                instant.fetch({
                    success: function(model, response) {
                        self.model.set(_.extend(data, response.data));
                        self.timeLineSource = 'http://image.sinajs.cn/newchart/min/n/' + (data.type + data.symbol).toLowerCase() + '.gif';
                    }
                });
            }
        });
    }
);
