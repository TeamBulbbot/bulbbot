const Discord = require("discord.js");
const paginationEmbed = require("discord.js-pagination");

const Emotes = require("../../../emotes.json");

module.exports = {
	Call: async (client, message, infs) => {
		const pages = [];
		for (let i = 0; i < infs.length; i++) {
			if (infs[i].targetID === "") continue;
			let user = await client.users.fetch(infs[i].targetID);

			let moderator = await client.users.fetch(infs[i].moderatorID);
			const action = AddEmotes(infs[i].action);

			let content = "";
			content += `**${action}**\n`;
			content += `**Infraction id:** ${infs[i].infID}\n`;
			content += `**Target:** ${user.username}#${user.discriminator} \`\`(${user.id})\`\`\n`;
			content += `**Moderator:** ${moderator.username}#${moderator.discriminator} \`\`(${moderator.id})\`\`\n`;
			content += `**Reason:**  ${infs[i].reportReason}\n`;
			content += `**Date:** ${infs[i].date}\n`;

			let embed = new Discord.MessageEmbed()
				.setColor(process.env.COLOR)
				.setTimestamp()
				.setDescription(content);
			pages.push(embed);
		}

		if (pages.length === 0)
			return message.channel.send("Was unable to find any infractions.");
		await paginationEmbed(message, pages, ["⏪", "⏩"], 120000);
	},
};

function AddEmotes(a) {
	let action;
	switch (a) {
		case "Warn":
			action = `${Emotes.actions.warn} Warn`;
			break;
		case "Mute":
			action = `${Emotes.actions.mute} Mute`;
			break;
		case "Kick":
			action = `${Emotes.actions.kick} Kick`;
			break;
		case "Ban":
			action = `${Emotes.actions.ban} Ban`;
			break;
		case "Force Ban":
			action = `${Emotes.actions.ban} Force Ban`;
			break;
		case "Softban":
			action = `${Emotes.actions.ban} Soft Ban`;
			break;
		case "Unban":
			action = `${Emotes.actions.unban} Unban`;
			break;
		default:
			action = a;
			break;
	}
	return action;
}
