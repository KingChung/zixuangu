var http = require('http');
var url = require('url');
var express = require('express');
var _ = require('underscore');
var BufferHelper = require('bufferhelper');
var iconv = require('iconv-lite');
var router = express.Router();
var qs = require('querystring');

var Stock = require('../model/stock');

var remoteApiMap = {
	//http://quotes.money.163.com/stocksearch/json.do?type=&count=1&word=601989&t=0.20890283794142306
	search: function(options){
		var _opts = {count: 5, t: +new Date()};
		if(_.isString(options)) {
			_opts.word = options;
		} else if(_.isObject(options)) {
			_opts = _.extend(_opts, options || {});
		}
		return url.format({
			protocol: 'http',
			host: 'quotes.money.163.com',
			pathname: '/stocksearch/json.do',
			query: _opts
		});
	},
	//http://hq.sinajs.cn/list=sh601006
	get: function(code){
		return qs.unescape(url.format({
			protocol: 'http',
			host: 'hq.sinajs.cn',
			query: {
				list: code.toLowerCase()
			}
		}));
	},
	list: function(codes){
		return qs.unescape(url.format({
			protocol: 'http',
			host: 'hq.sinajs.cn',
			query: {
				list: codes.toLowerCase()
			}
		}));
	}
};
var remoteApi = function(action){
	var rest = [].slice.call(arguments, 1);
	return remoteApiMap[action] && remoteApiMap[action].apply(this, rest);
};

//Parse sina's data
var parseSina = function(data){
	var result = (data.match(/="(.*)"/) || [])[1];
	if(result) {
		var fields = result.split(',');
		return {
			name: fields[0],
			opening_price: fields[1],
			last_price: fields[2],
			current_price: fields[3],
			change_price: (fields[3] - fields[2]).toFixed(2),
			change_percent: (fields[1] != 0) ? ((fields[3] - fields[2]) / fields[2] * 100).toFixed(2) : '',
			day_s_high: fields[4],
			day_s_low: fields[5],
			date: fields[30],
			time: fields[31]
		}
	}
	return false;
}

/* GET users listing. */
router.get('/', function(req, res, next) {
	var conditions = req.query || {};
	Stock.find(conditions, function(err, docs){
		if(err) next(err);
		res.json({
			result: true,
			data: docs
		});
	});
});

router.post('/', function(req, res, next) {
	if(!req.body.type || !req.body.symbol) {
		next(new Error('Symbol or Type cannot be blank'));
	}
	var code = req.body.type + req.body.symbol;
	http.get(remoteApi('get', code), function(r){
		var bufferHelper = new BufferHelper();
		r.on("data", function(chunk) {
		    bufferHelper.concat(chunk);
		});
		r.on('end', function() {
			var data = iconv.decode(bufferHelper.toBuffer(), 'gbk');
			var result = (data.match(/="(.*)"/) || [])[1];
			if(result) {
				var fields = result.split(',');
				if( ! fields[0]) {
					next(new Error("Cannot find the stock"));
				}

				Stock.findOne({name: fields[0]}, function(err, stock){
					if(err) next(err);
					if( ! stock) {
						Stock.create({
							name: fields[0],
							symbol: req.body.symbol,
							type: req.body.type
						}, function(err, stock) {
							if(err) next(err);
							res.json({
								result: true,
								data: stock
							});
						});
					} else {
						res.json({result: false, data: 'Already exists.'});
					}
				});
			} else {
				res.json({result: false, data: 'Not Found.'})
			}
		});
	});
});

router.put('/:id', function(req, res, next) {
	var body = req.body || {};
	var id = req.param('id');
	if(!id) return next(new Error('Stock id cannot be blank.'));

	var allowAttrs = ['symbol', 'type', 'setting'];
	body = _.pick(body, allowAttrs);

	if(body.setting) {
		var allowSettingAttrs = ['enable', 'count', 'range_percent', 'interval'];
		body.setting = _.pick(body.setting, allowSettingAttrs);
	}
	Stock.findByIdAndUpdate(id, body, {upsert: true}, function(err, doc){
		if(err) next(err);
		res.json({result: true, data: _.extend(doc, body)});
	});
});

router.delete('/:id', function(req, res, next) {
	var id = req.param("id");
	Stock.findByIdAndRemove(id, function(err, doc) {
		if(err) next(err);
		res.json({result: true, data: {id: id}});
	});
});

router.get('/search', function(req, res, next) {
	http.get(remoteApi('search', req.param('keyword')), function(r){
		var bufferHelper = new BufferHelper();
		r.on('data', function(chunk){
			bufferHelper.concat(chunk);
		});
		r.on('end', function(){
			data = (bufferHelper.toString().match(/\{.*\}/) || [])[0];
			res.json({
				result: true,
				data: _.map(data.replace(/\},\{/g, '}#{').split('#'), function(s){
					return JSON.parse(s);
				})
			});
		});
	});
});

var getRandom = function(min, max){
	return (Math.random() * (max - min) + min).toFixed(2);
}

router.get('/instant', function(req, res, next) {
	//List
	var codes = req.query.codes;
	if(codes) {
		http.get(remoteApi('list', qs.unescape(codes)), function(r){
			var bufferHelper = new BufferHelper();
			r.on('data', function(chunk){
				bufferHelper.concat(chunk);
			});
			r.on('end', function(){
				var result = [];
				var data = iconv.decode(bufferHelper.toBuffer(), 'gbk');
				_.each(data.split('\n'), function(v){
					v && result.push(parseSina(v));
				});
				if(result.length) {
					//@TEST
					// _.each(result, function(r, k){
					// 	var p = parseInt(r.current_price);
					// 	r.current_price = getRandom(p, p+2);
					// });
					
					res.json({
						result: true,
						data: result
					});
				} else {
					next();
				}
			});
		});
	} else {
		//View
		http.get(remoteApi('get', req.query.code), function(r){
			var bufferHelper = new BufferHelper();
			r.on('data', function(chunk){
				bufferHelper.concat(chunk);
			});
			r.on('end', function(){
				var data = parseSina(iconv.decode(bufferHelper.toBuffer(), 'gbk'));
				if(data) {
					res.json({
						result: true,
						data: data
					});
				} else {
					next();
				}
			});
		});
	}
});

module.exports = router;
