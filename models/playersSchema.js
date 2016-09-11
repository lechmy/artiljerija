var mongoose = require('mongoose');

var playersSchema = mongoose.Schema({
  username: {type: String, required: true, unique: true},
  password: {type: String, required: true}
}, {collection: 'players', versionKey: false});

var playersModel = mongoose.model('playersModel', playersSchema);
module.exports = playersModel;
