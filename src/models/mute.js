const mongoose = require("mongoose");

const muteSchema = mongoose.Schema({
	guildID: String,
	targetID: String,
	expireTime: String,
});

module.exports = mongoose.model("Mute", muteSchema);
