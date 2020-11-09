const mongoose = require("mongoose");

const tempBanSchema = mongoose.Schema({
	guildID: String,
	targetID: String,
	expireTime: String,
});

module.exports = mongoose.model("tempban", tempBanSchema);
