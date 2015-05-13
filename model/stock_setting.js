var mg = require('mongoose');

var schema = new mg.Schema({
	stock_id: String,
	enable: Boolean,
	count: Number,
	range_percent: Number,
	interval: Number,
	ctime: {type: Date, default: Date.now}
});

module.exports = mg.model('StockSetting', schema);