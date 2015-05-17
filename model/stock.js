var mg = require('mongoose');
var schema = new mg.Schema({
	"name": String,
	"symbol": String,
	"type": String,
	"ctime": {"type": Date, "default": Date.now},
	"setting": {
		"enable": {"type": Boolean, "default": true},
		"count": {"type": Number, "default": 3},
		"range_percent": {"type": Number, "default": 0.5},
		"interval": {"type": Number, "default": 60}
	}
});

module.exports = mg.model('Stock', schema);