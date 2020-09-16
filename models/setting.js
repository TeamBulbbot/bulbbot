const mongoose = require("mongoose");

const settingsSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	guildID: String,
	language: String,
	delete_server_invites: Boolean,
	trusted_server_invites: Array,
	allow_non_latin_usernames: Boolean,
	dm_on_action: Boolean,
	censored_words: Array,
	delete_links: Boolean,
	trusted_links: Array,
});

module.exports = mongoose.model("Setting", settingsSchema, "settings");
