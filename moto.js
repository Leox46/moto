var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// ci sono solo 3 data type: Object, String e Number.
var MotoSchema = new Schema({
	motoId: String,
	manufactor: String,
	model: String,
	displacement: Number,
	power: String
});

module.exports = mongoose.model('Moto', MotoSchema);
