const Guild = require("../utils/database/guild");
const clc = require("cli-color");
const Logger = require("../utils/other/winston");
const moment = require("moment");

module.exports = async (client, guild) => {
	Guild.Add(guild);
	client.channels.cache
		.get(process.env.BOT_INVITE)
		.send(
			`\`\`[${moment().format("hh:mm:ss a")}]\`\` **Joined guild:** ${
				guild.name
			} \`\`(${guild.id})\`\`owned by <@${guild.ownerID}> \`\`(${
				guild.ownerID
			})\`\`\n**Members: **${guild.memberCount} - **Bots:** ${
				guild.members.cache.filter((m) => m.user.bot).size
			} `
		);
	console.log(clc.green("[+] Joined guild"));
	Logger.info("Joined guild");
};
