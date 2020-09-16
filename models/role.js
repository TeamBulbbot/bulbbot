const mongoose = require("mongoose");

const rolesSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	guildID: String,
	admin: String,
	moderator: String,
	mute: String,
	trusted: String,
});

module.exports = mongoose.model("Role", rolesSchema, "roles");
