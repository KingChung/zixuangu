var http = require('http');
var url = require('url');
var express = require('express');
var _ = require('underscore');
var BufferHelper = require('bufferhelper');
var iconv = require('iconv-lite');
var router = express.Router();

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
	get: function(symbol, stockExchange){
		stockExchange = (stockExchange || 'sh').toLowerCase();
		return url.format({
			protocol: 'http',
			host: 'hq.sinajs.cn',
			query: {
				list: stockExchange + symbol
			}
		});
	}
};
var remoteApi = function(action){
	var rest = [].slice.call(arguments, 1);
	return remoteApiMap[action] && remoteApiMap[action].apply(this, rest);
};

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
	http.get(remoteApi('get', req.body.symbol, req.body.type), function(r){
		var bufferHelper = new BufferHelper();
		r.on("data", function(chunk) {
		    bufferHelper.concat(chunk);
		});
		r.on('end', function() {
			var data = iconv.decode(bufferHelper.toBuffer(), 'gbk');
			var result = (data.match(/="(.*)"/) || [])[1];
			if(result) {
				var fields = result.split(',');
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
						res.json({result: false, message: 'Already exists.'});
					}
					
				});
			} else {
				res.send({result: false, message: 'Not Found.'})
			}
		});
	});
});


router.get('/search', function(req, res, next) {
	http.get(remoteApi('search', req.param('keyword')), function(r){
		var data = '';
		r.on('data', function(chunk){
			data += chunk;
		});
		r.on('end', function(){
			data = (data.match(/\{.*\}/) || [])[0];
			res.json({
				result: true,
				data: _.map(data.replace(/\},\{/g, '}#{').split('#'), function(s){
					return JSON.parse(s);
				})
			});
		});
	});
});

module.exports = router;
