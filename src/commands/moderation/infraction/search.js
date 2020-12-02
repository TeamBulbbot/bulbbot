const Infraction = require("../../../models/infraction")
const Emotes = require("../../../emotes.json")
const Translator = require("../../../utils/lang/translator")
const Discord = require("discord.js")
const paginationEmbed = require("discord.js-pagination");

module.exports = {
	Call: (client, message, args) => {
		const pages = [];

		if (args[1] === undefined || args[1] === null)
			return message.channel.send(
				`${Emotes.actions.warn} Missing required argument \`\`user\`\`\n${Emotes.other.tools} Correct usage of command: \`\`infraction|inf search|msearch|modsearch <user>\`\``
			);

		Infraction.find(
			{
				guildID: message.guild.id,
				moderatorID: args[1].replace(/\D/g, ""),
			},
			async (err, infs) => {
				let moderator;
				try {
					moderator = await message.guild.member(args[1].replace(/\D/g, ""))
						.user;
				} catch (err) {
					if (err) console.log(err);
				}
				for (let i = 0; i < infs.length; i++) {
					let user = await client.users.fetch(infs[i].targetID);

					let content = "";
					content += `**${addEmotes(infs[i].action)}**\n`;
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
			}
		);

		Infraction.find(
			{
				guildID: message.guild.id,
				targetID: args[1].replace(/\D/g, ""),
			},
			async (err, infs) => {
				for (let i = 0; i < infs.length; i++) {
					let { moderator, user } = "";
					try {
						user = await message.guild.member(infs[i].targetID).user;
						moderator = await message.guild.member(infs[i].moderatorID)
							.user;
					} catch (error) {
						return message.channel.send(
							Translator.Translate("global_user_not_found", {
								user: args[1].replace(/\D/g, ""),
							})
						);
					}

					let content = "";
					content += `**${addEmotes(infs[i].action)}**\n`;
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
