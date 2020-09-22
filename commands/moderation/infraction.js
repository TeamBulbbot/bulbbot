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
	run: async (client, message, args) => {
		if (!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(":lock: Missing permission ``ADMINISTRATOR``"); // I know best has permssion lol

		const option = args[0];
		let target;

		pages = [];

		switch (option) {
			case "search":
			case "msearch":
			case "modsearch":
				target = args[1];
				Infraction.find(
					{
						guildID: message.guild.id,
						moderatorID: target,
					},
					async (err, infs) => {
						let moderator;
						try {
							moderator = await client.users.fetch(target);
						} catch (error) {
							return message.channel.send("User was not found");
						}
						for (let i = 0; i < infs.length; i++) {
							let user = await client.users.fetch(infs[i].targetID);

							let embed = new Discord.MessageEmbed().setColor(process.env.COLOR).setTimestamp().setAuthor(infs[i]._id).setTitle(infs[i].action).setDescription(
								`
                            **Target:** ${user.username}#${user.discriminator} \`\`(${user.id})\`\`
                            **Moderator:** ${moderator.username}#${moderator.discriminator} \`\`(${moderator.id})\`\`
                            **Reason:**  ${infs[i].reportReason}
                            **Date:** ${infs[i].date}
                            `
							);
							pages.push(embed);
						}

						if (pages.length === 0) return message.channel.send("Was unable to find any infractions.");
						paginationEmbed(message, pages, ["⏪", "⏩"], 120000);
					}
				);
				break;

			case "osearch":
			case "offedersearch":
				target = args[1];
				Infraction.find(
					{
						guildID: message.guild.id,
						targetID: target,
					},
					async (err, infs) => {
						for (let i = 0; i < infs.length; i++) {
							let user = await client.users.fetch(infs[i].targetID);
							let moderator = await client.users.fetch(infs[i].moderatorID);

							let embed = new Discord.MessageEmbed().setColor(process.env.COLOR).setTimestamp().setAuthor(infs[i]._id).setTitle(infs[i].action).setDescription(
								`
                                **Target:** ${user.username}#${user.discriminator} \`\`(${user.id})\`\`
                                **Moderator:** ${moderator.username}#${moderator.discriminator} \`\`(${moderator.id})\`\`
                                **Reason:**  ${infs[i].reportReason}
                                **Date:** ${infs[i].date}
                                `
							);
							pages.push(embed);
						}

						if (pages.length === 0) return message.channel.send("Was unable to find any infractions.");
						paginationEmbed(message, pages, ["⏪", "⏩"], 120000);
					}
				);
				break;

			case "remove":
				Infraction.find(
					{
						_id: args[1],
						guildID: message.guild.id,
					},
					async (err, infs) => {
						if (infs.length === 0) return message.channel.send(`Unable to find infraction with the id \`\`${args[1]}\`\` in **${message.guild.name}**`);
						await InfractionHandler.Remove(args[1], message.guild.id);
						message.channel.send(`Removed infraction \`\`${args[1]}\`\` in **${message.guild.name}**`);
						let reason = args[2] || "No reason given";
						await SendLog.Mod_action(client, message.guild.id, `${Emotes.actions.unban} Infraction \`\`${args[1]}\`\` was removed by **${message.author.username}**#${message.author.discriminator} \`\`(${message.author.id})\`\` \n**Reason:** ${reason} `, "");
					}
				);

				break;

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

							let embed = new Discord.MessageEmbed().setColor(process.env.COLOR).setTimestamp().setDescription(
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

						if (pages.length === 0) return message.channel.send("Was unable to find any infractions.");
						paginationEmbed(message, pages, ["⏪", "⏩"], 120000);
					}
				);
				break;
			default:
				break;
		}
	},
};
