const Guild = require("../../models/guild");
var clc = require("cli-color");

module.exports = {
	Change_Prefix: async (guildId, prefix) => {
		Guild.findOneAndUpdate({ guildID: guildId }, { guildPrefix: prefix }, function (error) {
			if (error) {
				console.error(clc.red(error));
			}
		});
	},

	Track_Analytics: async (guildId, state) => {
		Guild.findOneAndUpdate({ guildID: guildId }, { trackAnalytics: state }, function (error) {
			if (error) {
				console.error(clc.red(error));
			}
		});
	},
};
