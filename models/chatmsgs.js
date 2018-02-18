var db = require("../db");

var chatmsgSchema = new db.Schema({
  msgId:          { type: String, unique: true },
  liveChatId:     { type: String },
  displayName:    { type: String },
  displayMessage: { type: String }
});

var Chatmsg = db.model("Chatmsg", chatmsgSchema);

module.exports = Chatmsg;
