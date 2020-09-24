const mongoose = require("mongoose");
var clc = require("cli-color");

const Guild = require("../models/guild");
const Setting = require("../models/setting");
const Role = require("../models/role");
const Log = require("../models/log");

const CommandAnalytics = require("../models/commandAnalytics");

module.exports = {
	// Add the guild to the database
	AddGuild: async (guildObject) => {
		try {
			guild = new Guild({
				_id: mongoose.Types.ObjectId(),
				guildID: guildObject.id,
				guildName: guildObject.name,
				guildPrefix: process.env.PREFIX,
				trackAnalytics: true,
				joinDate: new Date(),
			});
			guild.save().catch((err) => console.error(clc.red(err)));

			setting = new Setting({
				_id: mongoose.Types.ObjectId(),
				guildID: guildObject.id,
				language: "en-us",
				delete_server_invites: false,
				trusted_server_invites: [],
				allow_non_latin_usernames: true,
				dm_on_action: false,
				censored_words: [],
				delete_links: false,
				trusted_links: [],
			});
			setting.save().catch((err) => console.error(clc.red(err)));

			role = new Role({
				_id: mongoose.Types.ObjectId(),
				guildID: guildObject.id,
				admin: "",
				moderator: "",
				mute: "",
				trusted: "",
			});
			role.save().catch((err) => console.error(clc.red(err)));

			log = new Log({
				_id: mongoose.Types.ObjectId(),
				guildID: guildObject.id,
				modAction: "",
				message: "",
				role: "",
				member: "",
				channel: "",
				join_leave: "",
			});
			log.save().catch((err) => console.error(clc.red(err)));

			return true;
		} catch (error) {
			console.error(clc.red(error));
			return false;
		}
	},

	// Remove the entire guild from the database
	RemoveGuild: async (guildObject) => {
		try {
			Guild.findOneAndDelete(
				{
					guildID: guildObject.id,
				},
				(err, res) => {
					if (err) console.error(clc.red(err));
				}
			);
			Setting.findOneAndDelete(
				{
					guildID: guildObject.id,
				},
				(err, res) => {
					if (err) console.error(clc.red(err));
				}
			);
			Role.findOneAndDelete(
				{
					guildID: guildObject.id,
				},
				(err, res) => {
					if (err) console.error(clc.red(err));
				}
			);
			Log.findOneAndDelete(
				{
					guildID: guildObject.id,
				},
				(err, res) => {
					if (err) console.error(clc.red(err));
				}
			);
			return true;
		} catch {
			return false;
		}
	},

	// Handler to know which commands are commonly used or not
	CommandAnalyticsHandler: async (commandName) => {
		CommandAnalytics.findOne({ commandName: commandName }, async (err, res) => {
			if (res === null) AddCommand(commandName);
			else IncrementCommand(commandName);
		});
	},
};
function AddCommand(commandName) {
	commandAnalytics = new CommandAnalytics({
		_id: mongoose.Types.ObjectId(),
		commandName: commandName,
		uses: 1,
	});
	commandAnalytics.save().catch((err) => console.error(clc.red(err)));
}

function IncrementCommand(commandName) {
	CommandAnalytics.findOneAndUpdate({ commandName: commandName }, { $inc: { uses: 1 } }, { new: true }, function (err, response) {
		if (err) console.error(clc.red(err));
	});
}
