var mg = require('mongoose');
mg.connect('mongodb://localhost/stock_app');

var schema = new mg.Schema({
	name: String,
	symbol: String,
	type: String,
	ctime: {type: Date, default: Date.now}
});

module.exports = mg.model('Stock', schema);