var mg = require('mongoose');
var schema = new mg.Schema({
	"name": String,
	"symbol": String,
	"type": String,
	"ctime": {"type": Date, "default": Date.now},
	"setting": {
		"enable": {"type": Boolean, "default": true},
		"count": {"type": Number, "default": 6},
		"range_percent": {"type": Number, "default": 0.05},
		"interval": {"type": Number, "default": 20}
	}
});

module.exports = mg.model('Stock', schema);