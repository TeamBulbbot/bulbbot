const Guild = require("../../models/guild");

module.exports = {
	Change_Prefix: async (guildId, prefix) => {
		Guild.findOneAndUpdate({ guildID: guildId }, { guildPrefix: prefix }, function (error) {
			if (error) {
				console.error(clc.red(error));
			}
		});
	},
};
