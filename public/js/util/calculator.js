define(
    [
        'backbone',
        'underscore',
        'store',
        'util/notify'
    ]
    , function(Backbone, _, Store, Notify){
        var Cache = {};

        var System = function(model, field, options){
            if(!(model instanceof Backbone.Model)) throw(new Error('Model is invalid'));
            this.model = model;
            this._field = field;
            this.setting = {
                "enable": true,
                "count": 6,
                "range_percent": 0.05,
                "interval": 20
            };
            this._init(options);
        };

        _.extend(System.prototype, {
            _init: function(options){
                this.setting = _.extend(this.setting, options || {});
                this._points = [];
                this._interval = Math.ceil(this.setting.interval / 10);
                this._interval_runtime = this._interval;

                //@TODO Change price per 10 seconds
                this.model.off('change:'+this._field, this.run, this);
                if(this.setting.enable) this.model.on('change:'+this._field, this.run, this);
            },
            run: function(model, price){
                if(this._interval_runtime) return this._interval_runtime--;
                this.store(price);
                this.calculate();
                this._interval_runtime = this._interval;
            },
            notify: function(message){
                Notify.notify(this.model.get('display_name'));
            },
            refresh: function(options){
                this._init(options);
            },
            store: function(price){
                var id = this.model.get('id');
                var points = Store.get(id) || [];
                var lastPoint = points[points.length - 1];

                //Clear store if last point's date is not equal current date
                var now = new Date(),
                    lastDate = lastPoint && new Date(lastPoint);
                if(now.getDate() == lastDate.getDate()) points = [];

                points.push({price: price, time: now.getTime()});
                if(points.length > this.setting.count) points = points.slice(-this.setting.count);

                Store.set(id, points);
                this._points = points;
                return points;
            },
            calculate: function(){
                if(this._points < this.setting.count) return;
                var points = _.map(this._points, function(p){
                    return p.price;
                });

                var middleIndex = Math.ceil(points.length / 2),
                    flexPoint = points[middleIndex],
                    firstPart = this._points.slice(0, middleIndex),
                    lastPart = this._points.slice(middleIndex),
                    range = this.setting.range_percent / 100,
                    pointsCount = this.setting.count,
                    result = false;

                console.log(this.model.get('name'), points.toString());

                //Rise after falling
                if(_.reduce(firstPart, function(memo, p){
                    if(!memo) return false;
                    return (p < memo) && p;
                })) {
                    result = _.reduce(lastPart, function(memo, p){
                        if(!memo) return false;
                        return (memo && ((p - memo) / memo) >= range) && p;
                    }, flexPoint);

                    if(result) return this.notify(pointsCount + "报价:" + points.toString());
                }

                //Fall after rising
                if(_.reduce(firstPart, function(memo, p){
                    if(!memo) return false;
                    return (p > memo) && p;
                })) {
                    result = _.reduce(lastPart, function(memo, p){
                        if(!memo) return false;
                        return (memo && ((memo - p) / memo) >= range) && p;
                    }, flexPoint);
                    if(result) return this.notify(pointsCount + "报价:" + points.toString());
                }
            }
        });

    	return {
            register: function(model, field, options){
                var id = model.get('id');
                if(Cache[id]) return Cache[id];
                return (Cache[id] = new System(model, field, options));
            },
            remove: function(id){
                Cache[id] && (delete Cache[id]);
            }
    	};
    }
);