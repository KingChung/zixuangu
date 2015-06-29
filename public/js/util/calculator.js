define(
    [
        'backbone',
        'underscore',
        'store',
        'config',
        'util/notify'
    ]
    , function(Backbone, _, Store, Config, Notify){
        var Cache = {};

        //@TODO Change price per 10 seconds
        var __PERSECONDECHANGE__ = Config.stock_refresh_rate;

        var System = function(model, field, options){
            if(!(model instanceof Backbone.Model)) throw(new Error('Model is invalid'));
            this.model = model;
            this._field = field;
            this.setting = {
                "enable": true,
                "count": 3,
                "range_percent": 0.5,
                "interval": 60
            };
            this._init(options);
        };

        _.extend(System.prototype, {
            _init: function(options){
                this.setting = _.extend(this.setting, options || {});
                this._points = [];
                this._interval = Math.ceil(this.setting.interval / __PERSECONDECHANGE__);
                this._interval_runtime = this._interval;

                this.model.off('change:'+this._field, this.run, this);
                if(this.setting.enable) this.model.on('change:'+this._field, this.run, this);
            },
            run: function(model, price){
                if(--this._interval_runtime) return;
                this.store(price);
                this.calculate();
                this._interval_runtime = this._interval;
            },
            notify: function(message){
                var notification = Notify.notify(this.model.get('display_name'), message);
                setTimeout(function(){
                    notification.close();
                }, 20e3);
            },
            refresh: function(options){
                this._init(options);
            },
            store: function(price){
                var id = this.model.get('id');
                var points = Store.get(id) || [];
                var lastPoint = points[points.length - 1],
                    lastTime = (lastPoint && lastPoint.time) || 0;

                //Clear store if last point's date is not equal current date
                var now = new Date();

                //Clear the localStorage if it more than half hour between the new point and last point
                if((now.getTime() - lastTime) > 30*60e3) points = [];

                points.push({price: price, time: now.getTime()});
                if(points.length > this.setting.count) points = points.slice(-this.setting.count);

                Store.set(id, points);
                this._points = points;
                return points;
            },
            calculate: function(){
                if(this._points.length < this.setting.count) return;
                var points = _.map(this._points, function(p){
                    return p.price;
                });

                var middleIndex = Math.ceil(points.length / 2) - 1,
                    firstPart = points.slice(0, middleIndex + 1),
                    lastPart = points.slice(middleIndex),
                    range = this.setting.range_percent / 100,
                    pointsCount = this.setting.count,
                    result = false;

                //Rise after falling
                if(_.reduce(firstPart, function(memo, p){
                    if(!memo) return false;
                    return (p < memo) && p;
                })) {
                    result = _.reduce(lastPart, function(memo, p){
                        if(!memo) return false;
                        return (memo && ((p - memo) / memo) >= range) && p;
                    });
                    if(result) return this.notify('时间: ' + (new Date()).toLocaleTimeString() + "\n报价: " + points.toString());
                }

                //Fall after rising
                if(_.reduce(firstPart, function(memo, p){
                    if(!memo) return false;
                    return (p > memo) && p;
                })) {
                    result = _.reduce(lastPart, function(memo, p){
                        if(!memo) return false;
                        return (memo && ((memo - p) / memo) >= range) && p;
                    });
                    if(result) return this.notify('时间: ' + (new Date()).toLocaleTimeString() + "\n报价: " + points.toString());
                }
            }
        });

    	return {
            register: function(model, field, options){
                var id = model.get('id');
                if(Cache[id]) return Cache[id];
                return (Cache[id] = new System(model, field, options));
            }
    	};
    }
);