const Guild = require("../utils/database/guild");
const clc = require("cli-color");
const moment = require("moment");

module.exports = async (client, guild) => {
	Guild.Remove(guild);
	client.channels.cache
		.get(process.env.BOT_INVITE)
		.send(
			`\`\`[${moment().format("hh:mm:ss a")}]\`\` **Left guild:** ${
				guild.name
			} owned by <@${guild.ownerID}> \`\`(${guild.ownerID})\`\`\n**Members: **${
				guild.memberCount
			} - **Bots:** ${guild.members.cache.filter((m) => m.user.bot).size} `
		);
	console.log(clc.yellow("[-] Removed from server"));
};
