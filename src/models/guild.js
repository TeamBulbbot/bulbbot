const mongoose = require("mongoose");

const guildSchema = mongoose.Schema({
	guildID: String,
	guildName: String,
	guildPrefix: String,
	trackAnalytics: Boolean,
	settings: {
		language: String,
		dm_on_action: Boolean,
		allow_non_latin_usernames: Boolean,
	},
	logChannels: {
		modAction: String,
		message: String,
		role: String,
		member: String,
		channel: String,
		join_leave: String,
	},
	roles: {
		mute: String,
	},
	moderationRoles: [
		{
			roleId: String,
			clearanceLevel: Number,
		},
	],
	overrideCommands: [
		{
			commandName: String,
			enabled: Boolean,
			clearanceLevel: Number,
		},
	],
	joinDate: Date,
});

module.exports = mongoose.model("Guild", guildSchema);
