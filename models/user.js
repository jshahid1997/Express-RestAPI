var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var passportMongoose = require("passport-local-mongoose");
var User = new Schema({
  admin: {
    type: Boolean,
    default: false,
  },
});

User.plugin(passportMongoose);

module.exports = mongoose.model("User", User);
