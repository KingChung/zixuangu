var mg = require('mongoose');

var schema = new mg.Schema({
	name: String,
	symbol: String,
	type: String,
	ctime: {type: Date, default: Date.now}
});

module.exports = mg.model('Stock', schema);