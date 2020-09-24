const Log = require("../models/log");
const moment = require("moment");
const clc = require("cli-color")

module.exports = {
	Mod_action: async (client, guildId, log, file) => {
		Log.findOne(
			{
				guildID: guildId,
			},
			async (err, res) => {
				if (err) console.error(`[Send Log - Mod Action] ${clc.red(err)}`);
				if (res.modAction === "") return;
				if (file === "") client.channels.cache.get(res.modAction).send(`\`\`[${moment().format("hh:mm:ss a")}]\`\` ${log}`);
				else
					client.channels.cache.get(res.modAction).send(`\`\`[${moment().format("hh:mm:ss a")}]\`\` ${log}`, {
						files: [file],
					});
			}
		);
	},

	Message_Log: async (client, guildId, log) => {
		Log.findOne(
			{
				guildID: guildId,
			},
			async (err, res) => {
				if (err) console.error(`[Send Log - Message Log] ${clc.red(err)}`);
				if (res.message === "") return;
				client.channels.cache.get(res.message).send(`\`\`[${moment().format("hh:mm:ss a")}]\`\` ${log}`);
			}
		);
	},

	Member_Updates: async (client, guildId, log) => {
		Log.findOne(
			{
				guildID: guildId,
			},
			async (err, res) => {
				if (err) console.error(`[Send Log - Member Update] ${clc.red(err)}`);
				if (res.member === "") return;
				client.channels.cache.get(res.member).send(`\`\`[${moment().format("hh:mm:ss a")}]\`\` ${log}`);
			}
		);
	},

	Join_leave_log: async (client, guildId, log) => {
		Log.findOne(
			{
				guildID: guildId,
			},
			async (err, res) => {
				if (err) console.error(`[Send Log - Join Leave] ${clc.red(err)}`);
				if (res.join_leave === "") return;
				client.channels.cache.get(res.member).send(`\`\`[${moment().format("hh:mm:ss a")}]\`\` ${log}`);
			}
		);
	},
};
