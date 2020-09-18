const Log = require("../../models/log");

module.exports = {
	Change_Mod_Action: async (guildId, channelId) => {
		Log.findOneAndUpdate({ guildID: guildId }, { modAction: channelId }, function (error) {
			if (error) {
				console.error(clc.red(error));
			}
		});
	},
	Change_Message: async (guildId, channelId) => {
		Log.findOneAndUpdate({ guildID: guildId }, { message: channelId }, function (error) {
			if (error) {
				console.error(clc.red(error));
			}
		});
	},
	Change_Role: async (guildId, channelId) => {
		Log.findOneAndUpdate({ guildID: guildId }, { role: channelId }, function (error) {
			if (error) {
				console.error(clc.red(error));
			}
		});
	},
	Change_Member: async (guildId, channelId) => {
		Log.findOneAndUpdate({ guildID: guildId }, { member: channelId }, function (error) {
			if (error) {
				console.error(clc.red(error));
			}
		});
	},
	Change_Channel: async (guildId, channelId) => {
		Log.findOneAndUpdate({ guildID: guildId }, { channel: channelId }, function (error) {
			if (error) {
				console.error(clc.red(error));
			}
		});
	},
	Change_Join_Leave: async (guildId, channelId) => {
		Log.findOneAndUpdate({ guildID: guildId }, { join_leave: channelId }, function (error) {
			if (error) {
				console.error(clc.red(error));
			}
		});
	},
};
