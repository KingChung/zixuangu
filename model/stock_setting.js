var mg = require('mongoose');

module.exports = new mg.Schema({
	stock_id: String,
	enable: Boolean,
	count: Number,
	range_percent: Number,
	interval: Number
});