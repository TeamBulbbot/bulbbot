const mongoose = require("mongoose");

const settingsSchema = mongoose.Schema({
	guildID: String,
	language: String,
	dm_on_action: Boolean,
	allow_non_latin_usernames: Boolean,
});

module.exports = mongoose.model("Setting", settingsSchema);
