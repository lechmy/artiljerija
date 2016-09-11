var mongoose = require('mongoose');

var statisticSchema = mongoose.Schema({
  username: {type: String, required: true, unique: true},
  gamesPlayed: Number
}, {collection: 'statistic', versionKey: false});

var statisticModel = mongoose.model('statisticModel', statisticSchema);
module.exports = statisticModel;
