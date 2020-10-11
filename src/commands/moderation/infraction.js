const Discord = require("discord.js");
const Infraction = require("../../models/infraction");
const InfractionHandler = require("../../handlers/Infraction");
const paginationEmbed = require("discord.js-pagination");
const Emotes = require("../../emotes.json");
const SendLog = require("../../handlers/SendLog");

module.exports = {
	name: "infraction",
	aliases: ["inf"],
	category: "moderation",
	description: "Infraction logs",
	usage: "infraction <option>",
	clientPermissions: ["SEND_MESSAGES", "VIEW_CHANNEL", "USE_EXTERNAL_EMOJIS"],
	run: async (client, message, args) => {
		if (!message.member.hasPermission("KICK_MEMBERS") || !message.member.roles.cache.has(roles.admin) || !message.member.roles.cache.has(roles.moderator))
			return message.channel.send(":lock: Missing permission"); // I know best has permssion lol
		if (args[0] === undefined || args[0] === null)
			return message.channel.send(
				`${Emotes.actions.warn} Missing required argument \`\`option\`\`\n${Emotes.other.tools} Correct usage of command: \`\`infraction|inf <option>\`\``
			);

		const option = args[0];

		const pages = [];

		switch (option) {
			// Search and find the infractions made by the mod id
			// infraction|inf search|msearch|modsearch <Mod ID>
			case "search":
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
							moderator = await client.users.fetch(args[1]);
						} catch (error) {
							return message.channel.send("User was not found");
						}
						for (let i = 0; i < infs.length; i++) {
							let user = await client.users.fetch(infs[i].targetID);

							let action;

							switch (infs[i].action) {
								case "Warn":
									action = `${Emotes.actions.warn} Warn`;
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
								case "Unban":
									action = `${Emotes.actions.unban} Unban`;
									break;

								default:
									action = infs[i].action;
									break;
							}

							let embed = new Discord.MessageEmbed()
								.setColor(process.env.COLOR)
								.setTimestamp()
								.setDescription(
									`
							**${action}**
							**Infraction id:** ${infs[i]._id}
                            **Target:** ${user.username}#${user.discriminator} \`\`(${user.id})\`\`
                            **Moderator:** ${moderator.username}#${moderator.discriminator} \`\`(${moderator.id})\`\`
                            **Reason:**  ${infs[i].reportReason}
                            **Date:** ${infs[i].date}
                            `
								);
							pages.push(embed);
						}

						if (pages.length === 0)
							return message.channel.send(
								"Was unable to find any infractions."
							);
						paginationEmbed(message, pages, ["⏪", "⏩"], 120000);
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
							let user = await client.users.fetch(infs[i].targetID);
							let moderator = await client.users.fetch(infs[i].moderatorID);

							let embed = new Discord.MessageEmbed()
								.setColor(process.env.COLOR)
								.setTimestamp()
								.setAuthor(infs[i]._id)
								.setTitle(infs[i].action)
								.setDescription(
									`
                                **Target:** ${user.username}#${user.discriminator} \`\`(${user.id})\`\`
                                **Moderator:** ${moderator.username}#${moderator.discriminator} \`\`(${moderator.id})\`\`
                                **Reason:**  ${infs[i].reportReason}
                                **Date:** ${infs[i].date}
                                `
								);
							pages.push(embed);
						}

						if (pages.length === 0)
							return message.channel.send(
								"Was unable to find any infractions."
							);
						paginationEmbed(message, pages, ["⏪", "⏩"], 120000);
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
						InfractionHandler.Update(args[1], message.guild.id, reason);
						message.channel.send(
							`${Emotes.other.wrench} Updated infraction \`\`${args[1]}\`\` in **${message.guild.name}**`
						);
						await SendLog.Mod_action(
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
						InfractionHandler.Claim(args[1], message.guild.id, user);

						message.channel.send(
							`${Emotes.other.wrench} Updated infraction \`\`${args[1]}\`\` in **${message.guild.name}**`
						);
						SendLog.Mod_action(
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
						await InfractionHandler.Remove(args[1], message.guild.id);
						message.channel.send(
							`Removed infraction \`\`${args[1]}\`\` in **${message.guild.name}**`
						);
						let reason = args.slice(2).join(" ") || "No reason given";
						SendLog.Mod_action(
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
						let action;

						switch (inf.action) {
							case "Warn":
								action = `${Emotes.actions.warn} Warn`;
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
							case "Unban":
								action = `${Emotes.actions.unban} Unban`;
								break;

							default:
								action = inf.action;
								break;
						}

						let user = await client.users.fetch(inf.targetID);
						let moderator = await client.users.fetch(inf.moderatorID);

						let embed = new Discord.MessageEmbed()
							.setColor(process.env.COLOR)
							.setTimestamp()
							.setThumbnail(user.avatarURL())
							.setDescription(
								`
								**${action}**
								**Infraction id:** ${inf._id}
                                **Target:** ${user.username}#${user.discriminator} \`\`(${user.id})\`\`
                                **Moderator:** ${moderator.username}#${moderator.discriminator} \`\`(${moderator.id})\`\`
                                **Reason:**  ${inf.reportReason}
                                **Date:** ${inf.date}
                                `
							);
						message.channel.send(embed);
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
							let user = await client.users.fetch(infs[i].targetID);
							let moderator = await client.users.fetch(infs[i].moderatorID);
							let action;

							switch (infs[i].action) {
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
								case "Unban":
									action = `${Emotes.actions.unban} Unban`;
									break;

								default:
									action = infs[i].action;
									break;
							}

							let embed = new Discord.MessageEmbed()
								.setColor(process.env.COLOR)
								.setTimestamp()
								.setDescription(
									`
								**${action}**
								**Infraction id:** ${infs[i]._id}
                                **Target:** ${user.username}#${user.discriminator} \`\`(${user.id})\`\`
                                **Moderator:** ${moderator.username}#${moderator.discriminator} \`\`(${moderator.id})\`\`
                                **Reason:**  ${infs[i].reportReason}
                                **Date:** ${infs[i].date}
                                `
								);
							pages.push(embed);
						}

						if (pages.length === 0)
							return message.channel.send(
								"Was unable to find any infractions."
							);
						paginationEmbed(message, pages, ["⏪", "⏩"], 120000);
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
