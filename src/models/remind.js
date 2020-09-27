const mongoose = require("mongoose");

const remindSchema = mongoose.Schema({
	userID: String,
	dmRemind: Boolean,
	channelID: String,
	reminder: String,
	expireTime: String,
});

module.exports = mongoose.model("Remind", remindSchema);
