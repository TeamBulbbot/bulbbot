const mongoose = require("mongoose");
const clc = require("cli-color");

const Guild = require("../../models/guild");
const Setting = require("../../models/setting");
const Role = require("../../models/role");
const Log = require("../../models/log");

module.exports = {
	// Add the guild to the database
	Add: (guildObject) => {
		try {
			const guild = new Guild({
				_id: mongoose.Types.ObjectId(),
				guildID: guildObject.id,
				guildName: guildObject.name,
				guildPrefix: process.env.PREFIX,
				trackAnalytics: true,
				joinDate: new Date(),
			});
			guild.save().catch((err) => console.error(clc.red(err)));

			const setting = new Setting({
				_id: mongoose.Types.ObjectId(),
				guildID: guildObject.id,
				language: "en-us",
				dm_on_action: false,
				allow_non_latin_usernames: false,
			});
			setting.save().catch((err) => console.error(clc.red(err)));

			const role = new Role({
				_id: mongoose.Types.ObjectId(),
				guildID: guildObject.id,
				admin: "",
				moderator: "",
				mute: "",
				trusted: "",
			});
			role.save().catch((err) => console.error(clc.red(err)));

			const log = new Log({
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
		} catch (err) {
			console.error(clc.red(err));
			return false;
		}
	},

	// Remove the entire guild from the database
	Remove: (guildObject) => {
		try {
			Guild.findOneAndDelete(
				{
					guildID: guildObject.id,
				},
				(err, _res) => {
					if (err) console.error(clc.red(err));
				}
			);
			Setting.findOneAndDelete(
				{
					guildID: guildObject.id,
				},
				(err, _res) => {
					if (err) console.error(clc.red(err));
				}
			);
			Role.findOneAndDelete(
				{
					guildID: guildObject.id,
				},
				(err, _res) => {
					if (err) console.error(clc.red(err));
				}
			);
			Log.findOneAndDelete(
				{
					guildID: guildObject.id,
				},
				(err, _res) => {
					if (err) console.error(clc.red(err));
				}
			);

			return true;
		} catch (err) {
			console.error(clc.red(err));
			return false;
		}
	},
};
