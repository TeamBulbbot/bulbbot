const mongoose = require("mongoose");

const guildSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	guildID: String,
	guildName: String,
	guildPrefix: String,
	joinDate: Date,
});

module.exports = mongoose.model("Guild", guildSchema, "guilds");
