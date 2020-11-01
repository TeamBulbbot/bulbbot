const mongoose = require("mongoose");

const Guild = require("../../models/guild");
const Logger = require("../../utils/other/winston");

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
				settings: {
					language: "en-us",
					dm_on_action: false,
					allow_non_latin_usernames: false,
				},
				logChannels: {
					modAction: "",
					message: "",
					role: "",
					member: "",
					channel: "",
					join_leave: "",
				},
				roles: {
					mute: "",
				},
				joinDate: new Date(),
			});
			guild.save().catch((err) => Logger.error(err));

			return true;
		} catch (err) {
			Logger.error(err);
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
					if (err) Logger.error(err);
				}
			);

			return true;
		} catch (err) {
			Logger.error(err);
			return false;
		}
	},
};
