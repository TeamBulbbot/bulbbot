const Log = require("../models/log");
const moment = require("moment");

module.exports = {
	Mod_action: async (client, guildId, log, file) => {
		Log.findOne(
			{
				guildID: guildId,
			},
			async (err, res) => {
				if (res.modAction === "") return;
				if (file === "") client.channels.cache.get(res.modAction).send(`\`\`[${moment().format("hh:mm:ss a")}]\`\` ${log}`);
				else
					client.channels.cache.get(res.modAction).send(`\`\`[${moment().format("hh:mm:ss a")}]\`\` ${log}`, {
						files: [file],
					});
			}
		);
	},
};
