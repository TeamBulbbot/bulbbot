const Discord = require("discord.js");
const paginationEmbed = require("discord.js-pagination");

const Infraction = require("../../models/infraction");
const InfractionUtils = require("../../utils/moderation/infraction");
const Log = require("../../utils/moderation/log");
const Emotes = require("../../emotes.json");
const Translator = require("../../utils/lang/translator")

module.exports = {
	name: "infraction",
	aliases: ["inf"],
	category: "moderation",
	description: "Infraction related commands",
	usage: "infraction <option>",
	clientPermissions: ["SEND_MESSAGES", "VIEW_CHANNEL", "USE_EXTERNAL_EMOJIS"],
	userPermissions: ["BAN_MEMBERS", "KICK_MEMBERS", "MANAGE_GUILD"],
	clearanceLevel: 50,
	run: async (client, message, args) => {
		if (args[0] === undefined || args[0] === null)
			return message.channel.send(
				Translator.Translate("infraction_missing_arg_option")
			);

		const option = args[0];

		const pages = [];

		switch (option) {
			// Search and find all infractions that have the provided ID set on them
			// infraction|inf search| <ID>
			case "search":
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
							moderator = await message.guild.member(args[1].replace(/\D/g, "")).user;
						} catch (err) {

						}
						for (let i = 0; i < infs.length; i++) {
							let user = await client.users.fetch(infs[i].targetID);

							let content = "";
							content += `**${addEmotes(infs[i].action)}**\n`
							content += `**Infraction id:** ${infs[i].infId}\n`
							content += `**Target:** ${user.username}#${user.discriminator} \`\`(${user.id})\`\`\n`
							content += `**Moderator:** ${moderator.username}#${moderator.discriminator} \`\`(${moderator.id})\`\`\n`
							content += `**Reason:**  ${infs[i].reportReason}\n`
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
								moderator = await message.guild.member(infs[i].moderatorID).user;
							} catch (error) {
								return message.channel.send(Translator.Translate("global_user_not_found", {user: args[1].replace(/\D/g, "")}));
							}

							let content = "";
							content += `**${addEmotes(infs[i].action)}**\n`
							content += `**Infraction id:** ${infs[i].infId}\n`
							content += `**Target:** ${user.username}#${user.discriminator} \`\`(${user.id})\`\`\n`
							content += `**Moderator:** ${moderator.username}#${moderator.discriminator} \`\`(${moderator.id})\`\`\n`
							content += `**Reason:**  ${infs[i].reportReason}\n`
							content += `**Date:** ${infs[i].date}\n`;

							let embed = new Discord.MessageEmbed()
								.setColor(process.env.COLOR)
								.setTimestamp()
								.setDescription(content);
							pages.push(embed);
						}

						if (pages.length === 0)
							return message.channel.send(
								Translator.Translate("infraction_no_infractions", {user: args[1].replace(/\D/g, "")})
							);
						await paginationEmbed(message, pages, ["⏪", "⏩"], 120000);
					}
				);
				break;

			// Search and find all the infractions made by the Mod ID
			// infraction|inf msearch|modsearch <Mod ID>
			case "msearch":
			case "modsearch":
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
							moderator = await message.guild.member(args[1].replace(/\D/g, "")).user;
						} catch (error) {
							return message.channel.send("User was not found");
						}
						for (let i = 0; i < infs.length; i++) {
							let user = await client.users.fetch(infs[i].targetID);
							const action = addEmotes(infs[i].action);

							let content = "";
							content += `**${action}**\n`
							content += `**Infraction id:** ${infs[i].infId}\n`
							content += `**Target:** ${user.username}#${user.discriminator} \`\`(${user.id})\`\`\n`
							content += `**Moderator:** ${moderator.username}#${moderator.discriminator} \`\`(${moderator.id})\`\`\n`
							content += `**Reason:**  ${infs[i].reportReason}\n`
							content += `**Date:** ${infs[i].date}\n`;

							let embed = new Discord.MessageEmbed()
								.setColor(process.env.COLOR)
								.setTimestamp()
								.setDescription(content);
							pages.push(embed);
						}

						if (pages.length === 0)
							return message.channel.send(
								Translator.Translate("infraction_no_infractions", {user: args[1].replace(/\D/g, "")})
							);
						await paginationEmbed(message, pages, ["⏪", "⏩"], 120000);
					}
				);
				break;

			// Search and find all the infractions target to that id
			// infraction|inf osearch|offedersearch <Target ID>
			case "osearch":
			case "offedersearch":
				if (args[1] === undefined || args[1] === null)
					return message.channel.send(
						`${Emotes.actions.warn} Missing required argument \`\`user\`\`\n${Emotes.other.tools} Correct usage of command: \`\`infraction|inf osearch|offedersearch <user>\`\``
					);

				Infraction.find(
					{
						guildID: message.guild.id,
						targetID: args[1].replace(/\D/g, ""),
					},
					async (err, infs) => {
						for (let i = 0; i < infs.length; i++) {
							let user = await message.guild.member(infs[i].targetID).user;
							let moderator = await message.guild.member(infs[i].moderatorID).user;

							let content = "";
							content += `**${addEmotes(infs[i].action)}**\n`
							content += `**Infraction id:** ${infs[i].infId}\n`
							content += `**Target:** ${user.username}#${user.discriminator} \`\`(${user.id})\`\`\n`
							content += `**Moderator:** ${moderator.username}#${moderator.discriminator} \`\`(${moderator.id})\`\`\n`
							content += `**Reason:**  ${infs[i].reportReason}\n`
							content += `**Date:** ${infs[i].date}\n`;

							let embed = new Discord.MessageEmbed()
								.setColor(process.env.COLOR)
								.setTimestamp()
								.setDescription(content);
							pages.push(embed);
						}

						if (pages.length === 0)
							return message.channel.send(
								Translator.Translate("infraction_no_infractions", {user: args[1].replace(/\D/g, "")})
							);
						await paginationEmbed(message, pages, ["⏪", "⏩"], 120000);
					}
				);
				break;

			// Edit the response reason for a infraction
			// infraction|inf edit|update <Infraction Id> [New reason]
			case "edit":
			case "update":
				if (args[1] === undefined || args[1] === null)
					return message.channel.send(
						`${Emotes.actions.warn} Missing required argument \`\`id\`\`\n${Emotes.other.tools} Correct usage of command: \`\`infraction|inf edit|update <id> [reason]\`\``
					);

				Infraction.findOne(
					{
						_id: args[1],
						guildID: message.guild.id,
					},
					async (err, inf) => {
						if (inf === null || inf === undefined)
							return message.channel.send(
								`Unable to find infraction with the id \`\`${args[1]}\`\` in **${message.guild.name}**`
							);
						let reason = args.slice(2).join(" ") || "No reason given";
						await InfractionUtils.Update(args[1], message.guild.id, reason);
						message.channel.send(
							`${Emotes.other.wrench} Updated infraction \`\`${args[1]}\`\` in **${message.guild.name}**`
						);
						await Log.Mod_action(
							client,
							message.guild.id,
							`${Emotes.other.wrench} Infraction \`\`${args[1]}\`\` was edited by **${message.author.username}**#${message.author.discriminator} \`\`(${message.author.id})\`\`\n**Reason:** ${reason}`,
							""
						);
					}
				);

				break;

			// Claim responsibilty another infraction
			// infraction|inf claim <Infraction Id>
			case "claim":
				if (args[1] === undefined || args[1] === null)
					return message.channel.send(
						`${Emotes.actions.warn} Missing required argument \`\`id\`\`\n${Emotes.other.tools} Correct usage of command: \`\`infraction|inf claim <id>\`\``
					);

				Infraction.findOne(
					{
						_id: args[1],
						guildID: message.guild.id,
					},
					async (err, inf) => {
						if (inf === null || inf === undefined)
							return message.channel.send(
								`Unable to find infraction with the id \`\`${args[1]}\`\` in **${message.guild.name}**`
							);
						let user = await client.users.fetch(args[2] || message.author.id);
						await InfractionUtils.Claim(args[1], message.guild.id, user);

						message.channel.send(
							`${Emotes.other.wrench} Updated infraction \`\`${args[1]}\`\` in **${message.guild.name}**`
						);
						await Log.Mod_action(
							client,
							message.guild.id,
							`${Emotes.other.wrench} Infraction \`\`${args[1]}\`\` was claimed by **${user.username}**#${user.discriminator} \`\`(${user.id})\`\``,
							""
						);
					}
				);

				break;

			// Delete and infraction from the system
			// infraction|inf delete|del|remove <Infraction Id> [Reason]
			case "delete":
			case "del":
			case "remove":
				if (!message.member.hasPermission("ADMINISTRATOR"))
					return message.channel.send(":lock: Missing permission "); // I know best has permssion lol
				if (args[1] === undefined || args[1] === null)
					return message.channel.send(
						`${Emotes.actions.warn} Missing required argument \`\`id\`\`\n${Emotes.other.tools} Correct usage of command: \`\`infraction|inf delete|del|remove <id> [reason]\`\``
					);

				Infraction.findOne(
					{
						_id: args[1],
						guildID: message.guild.id,
					},
					async (err, infs) => {
						if (infs === null || infs === undefined)
							return message.channel.send(
								`Unable to find infraction with the id \`\`${args[1]}\`\` in **${message.guild.name}**`
							);
						await InfractionUtils.Remove(args[1], message.guild.id);
						message.channel.send(
							`Removed infraction \`\`${args[1]}\`\` in **${message.guild.name}**`
						);
						let reason = args.slice(2).join(" ") || "No reason given";
						await Log.Mod_action(
							client,
							message.guild.id,
							`${Emotes.actions.unban} Infraction \`\`${args[1]}\`\` was removed by **${message.author.username}**#${message.author.discriminator} \`\`(${message.author.id})\`\` \n**Reason:** ${reason} `,
							""
						);
					}
				);

				break;

			// Get info about a infracton
			// infraction|inf info <Infraction Id>
			case "info":
				if (args[1] === undefined || args[1] === null)
					return message.channel.send(
						`${Emotes.actions.warn} Missing required argument \`\`id\`\`\n${Emotes.other.tools} Correct usage of command: \`\`infraction|inf| info <id> \`\``
					);

				Infraction.findOne(
					{
						_id: args[1],
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
						content += `**${action}**\n`
						content += `**Infraction id:** ${inf._id}\n`
						content += `**Target:** ${user.username}#${user.discriminator} \`\`(${user.id})\`\`\n`
						content += `**Moderator:** ${moderator.username}#${moderator.discriminator} \`\`(${moderator.id})\`\`\n`
						content += `**Reason:**  ${inf.reportReason}\n`
						content += `**Date:** ${inf.date}\n`

						let embed = new Discord.MessageEmbed()
							.setColor(process.env.COLOR)
							.setTimestamp()
							.setThumbnail(user.avatarURL())
							.setDescription(content);
						await message.channel.send(embed);
					}
				);
				break;

			// Return all infractions in guild
			// infraction|inf all|list
			case "all":
			case "list":
				Infraction.find(
					{
						guildID: message.guild.id,
					},
					async (err, infs) => {
						for (let i = 0; i < infs.length; i++) {
							if (infs[i].targetID === "") continue;
							let user = await client.users.fetch(infs[i].targetID);

							let moderator = await client.users.fetch(infs[i].moderatorID);
							const action = addEmotes(infs[i].action);

							let content = "";
							content += `**${action}**\n`
							content += `**Infraction id:** ${infs[i].infID}\n`
							content += `**Target:** ${user.username}#${user.discriminator} \`\`(${user.id})\`\`\n`
							content += `**Moderator:** ${moderator.username}#${moderator.discriminator} \`\`(${moderator.id})\`\`\n`
							content += `**Reason:**  ${infs[i].reportReason}\n`
							content += `**Date:** ${infs[i].date}\n`;

							let embed = new Discord.MessageEmbed()
								.setColor(process.env.COLOR)
								.setTimestamp()
								.setDescription(content);
							pages.push(embed);
						}

						if (pages.length === 0)
							return message.channel.send(
								"Was unable to find any infractions."
							);
						await paginationEmbed(message, pages, ["⏪", "⏩"], 120000);
					}
				);
				break;
			default:
				message.channel.send(
					`${Emotes.actions.warn} Invalid \`\`option\`\`\n${Emotes.other.tools} Correct usage of command: \`\`infraction|inf| <option>\`\`\n**Options:** \`\`search|msearch|modsearch\`\`, \`\`osearch|offedersearch\`\`, \`\`edit|update\`\`, \`\`claim\`\`, \`\`delete|del|remove\`\`, \`\`info\`\`, \`\`all|list\`\``
				);
				break;
		}
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
