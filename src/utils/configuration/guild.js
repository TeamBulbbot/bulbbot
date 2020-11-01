const Guild = require("../../models/guild");
const clc = require("cli-color");
const Logger = require("../../utils/other/winston");

module.exports = {
	Change_Prefix: async (guildId, prefix) => {
		Guild.findOneAndUpdate(
			{ guildID: guildId },
			{ guildPrefix: prefix },
			function (err) {
				if (err) Logger.error(err);
			}
		);
	},

	Track_Analytics: async (guildId, state) => {
		Guild.findOneAndUpdate(
			{ guildID: guildId },
			{ trackAnalytics: state },
			function (err) {
				if (err) Logger.error(err);
			}
		);
	},
};
