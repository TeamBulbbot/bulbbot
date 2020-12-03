const Infraction = require("../../../models/infraction")
const Emotes = require("../../../emotes.json")
const Discord = require("discord.js")

module.exports = {
	Call: (client, message, args) => {
		if (args[1] === undefined || args[1] === null)
			return message.channel.send(
				`${Emotes.actions.warn} Missing required argument \`\`id\`\`\n${Emotes.other.tools} Correct usage of command: \`\`infraction|inf| info <id> \`\``
			);

		Infraction.findOne(
			{
				infID: args[1],
				guildID: message.guild.id,
			},
			async (err, inf) => {
				if (inf === null || inf === undefined)
					return message.channel.send(
						`Unable to find infraction with the id \`\`${args[1]}\`\` in **${message.guild.name}**`
					);
				const action = addEmotes(inf.action);

				let user = await client.users.fetch(inf.targetID);
				let moderator = await client.users.fetch(inf.moderatorID);

				let content = "";
				content += `**${action}**\n`;
				content += `**Infraction id:** ${inf.infID}\n`;
				content += `**Target:** ${user.username}#${user.discriminator} \`\`(${user.id})\`\`\n`;
				content += `**Moderator:** ${moderator.username}#${moderator.discriminator} \`\`(${moderator.id})\`\`\n`;
				content += `**Reason:**  ${inf.reportReason}\n`;
				content += `**Date:** ${inf.date}\n`;

				let embed = new Discord.MessageEmbed()
					.setColor(process.env.COLOR)
					.setTimestamp()
					.setThumbnail(user.avatarURL())
					.setDescription(content);
				await message.channel.send(embed);
			}
		);
	},
};

function addEmotes(a) {
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
