var mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/youtubedb");

module.exports = mongoose;
