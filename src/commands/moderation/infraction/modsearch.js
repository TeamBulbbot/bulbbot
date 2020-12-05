const Infraction = require("../../../models/infraction")
const Emotes = require("../../../emotes.json")
const Translator = require("../../../utils/lang/translator")
const Discord = require("discord.js")
const paginationEmbed = require("discord.js-pagination");

module.exports = {
	Call: (client, message, args) => {
		if (args[1] === undefined || args[1] === null)
			return message.channel.send(
				`${Emotes.actions.warn} Missing required argument \`\`user\`\`\n${Emotes.other.tools} Correct usage of command: \`\`infraction|inf search|msearch|modsearch <user>\`\``
			);

		const pages = [];

		Infraction.find(
			{
				guildID: message.guild.id,
				moderatorID: args[1].replace(/\D/g, ""),
			},
			async (err, infs) => {
				let moderator;
				try {
					moderator = await client.users.fetch(args[1].replace(/\D/g, ""))
						.user;
				} catch (error) {
					return message.channel.send("User was not found");
				}
				for (let i = 0; i < infs.length; i++) {
					let user = await client.users.fetch(infs[i].targetID);
					const action = addEmotes(infs[i].action);

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
					return message.channel.send(
						Translator.Translate("infraction_no_infractions", {
							user: args[1].replace(/\D/g, ""),
						})
					);
				await paginationEmbed(message, pages, ["⏪", "⏩"], 120000);
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
