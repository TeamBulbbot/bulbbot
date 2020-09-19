const Log = require("../models/log");

module.exports = {
	Mod_action: async (client, guildId, log, file) => {
		Log.findOne(
			{
				guildID: guildId,
			},
			async (err, res) => {
				if (res.modAction === "") return;
				client.channels.cache.get(res.modAction).send(log, {
					files: [file],
				});
			}
		);
	},
};
