const Discord = require("discord.js");
const Helper = require("../../handlers/Helper");
const moment = require("moment");
const Emotes = require("../../emotes.json");
const Moderation = require("../../handlers/Moderation");
const SendLog = require("../../handlers/SendLog");
const Infraction = require("../../models/infraction");
const Role = require("../../models/role");

module.exports = {
	name: "usermanagement",
	aliases: ["usermgmt", "um"],
	category: "moderation",
	description: "Moderation command on user",
	usage: "usermanagement <user>",
	run: async (client, message, args) => {
		Role.findOne(
			{
				guildID: message.guild.id,
			},
			async (err, roles) => {
				if (
					message.member.roles.cache.has(roles.admin) ||
					message.member.roles.cache.has(roles.moderator) ||
					message.member.hasPermission("BAN_MEMBERS") ||
					message.member.hasPermission("KICK_MEMBERS")
				) {
					if (args[0] === undefined || args[0] === null)
						return message.channel.send(
							`${Emotes.actions.warn} Missing required argument \`\`user\`\`\n${Emotes.other.tools} Correct usage of command: \`\`usermanagement|usermgmt|um <user>\`\``
						);

					Infraction.find(
						{
							guildID: message.guild.id,
							targetID: args[0].replace(/\D/g, ""),
						},
						async (err, infs) => {
							let target = args[0].replace(/\D/g, ""); // Remove everything except numbers
							let user = message.guild.member(target);

							let descriptionBottom = "";
							let description = "";

							const end = moment.utc().format("YYYY-MM-DD");
							let start = "";

							if (user !== null) {
								user.nickname !== null
									? (descriptionBottom += `**Nickname: ** ${user.nickname}\n`)
									: "";

								start = moment(
									moment.utc(user.joinedTimestamp).format("YYYY-MM-DD")
								);
								const daysInServer = moment.duration(start.diff(end)).asDays();

								descriptionBottom += `**Joined server:** ${moment
									.utc(user.joinedTimestamp)
									.format(
										"dddd, MMMM, Do YYYY"
									)} \`\`(${daysInServer
									.toString()
									.replace("-", "")} days ago)\`\`\n`;
								descriptionBottom += `**Roles: ** ${user._roles
									.map((i) => `<@&${i}>`)
									.join(" ")}\n`;

								user = user.user;
							} else return message.channel.send("User is not in server");

							description += `${await Helper.Badges(user.flags.bitfield)}\n`;
							description += `**ID: ** ${user.id}\n`;
							description += `**Username: **${user.username}#${user.discriminator}\n`;
							description += `**Profile: ** <@${user.id}>\n`;
							description += `**Avatar URL:** [Link](${user.avatarURL()})\n`;
							description += `**Bot: ** ${user.bot}\n`;

							start = moment(moment(user.createdAt).format("YYYY-MM-DD"));
							const daysOnDiscord = moment.duration(start.diff(end)).asDays();
							description += `**Account creation:** ${moment(
								user.createdAt
							).format("dddd, MMMM, Do YYYY")} \`\`(${Math.floor(daysOnDiscord)
								.toString()
								.replace("-", "")} days ago)\`\``;

							if (infs.length > 0) {
								descriptionBottom += `**Infractions: ** ${Math.floor(
									infs.length
								)}\n\n`;
								let moderator = await client.users.fetch(
									infs[infs.length - 1].moderatorID
								);
								descriptionBottom += `**Recent infraction: ** ${
									infs[infs.length - 1]._id
								}\n**Action: **${infs[infs.length - 1].action}\n**Reason: **${
									infs[infs.length - 1].reportReason
								}\n**Moderator: ** ${moderator.username}#${
									moderator.discriminator
								} \`\`(${moderator.id})\`\``;
							}
							let embed = new Discord.MessageEmbed()
								.setColor(process.env.COLOR)
								.setTimestamp()
								.setFooter(
									`Executed by ${message.author.username}#${message.author.discriminator}`,
									message.author.avatarURL()
								)
								.setThumbnail(user.avatarURL())
								.setAuthor(
									`${user.username}#${user.discriminator}`,
									user.avatarURL()
								).setDescription(`
${description}
${descriptionBottom}

		`);

							message.channel.send(embed).then(async (msg) => {
								await msg
									.react(Emotes.actions.cancel.replace(/\D/g, "")) // Cancel
									.then(() => msg.react(Emotes.actions.warn.replace(/\D/g, ""))) // Warn
									.then(() =>
										msg.react(Emotes.actions.kick.replace(/\D/g, ""))
									); // Kick

								if (
									message.member.roles.cache.has(roles.admin) ||
									message.member.hasPermission("BAN_MEMBERS")
								)
									msg.react(Emotes.actions.ban.replace(/\D/g, "")); // Ban

								const filter = (reaction, user) => {
									return (
										[
											Emotes.actions.warn.replace(/\D/g, ""),
											Emotes.actions.kick.replace(/\D/g, ""),
											Emotes.actions.ban.replace(/\D/g, ""),
											Emotes.actions.cancel.replace(/\D/g, ""),
										].includes(reaction.emoji.id) &&
										user.id === message.author.id
									);
								};

								msg
									.awaitReactions(filter, {
										max: 1,
										time: 60000,
										errors: ["time"],
									})
									.then(async (collected) => {
										const reaction = collected.first();

										if (
											reaction.emoji.id ===
											Emotes.actions.warn.replace(/\D/g, "")
										) {
											Perfom_Action(
												client,
												message,
												Emotes.actions.warn,
												"Warn",
												"Warning",
												user
											);
										} else if (
											reaction.emoji.id ===
											Emotes.actions.kick.replace(/\D/g, "")
										) {
											Perfom_Action(
												client,
												message,
												Emotes.actions.kick,
												"Kick",
												"Kicking",
												user
											);
										} else if (
											reaction.emoji.id ===
											Emotes.actions.ban.replace(/\D/g, "")
										) {
											Perfom_Action(
												client,
												message,
												Emotes.actions.ban,
												"Ban",
												"Banning",
												user
											);
										} else if (
											reaction.emoji.id ===
											Emotes.actions.cancel.replace(/\D/g, "")
										)
											return message.channel.send(
												`${Emotes.actions.cancel} Canceling the operation.`
											);
										else
											return message.channel.send(
												`${Emotes.actions.cancel} Canceling the operation.`
											);
									})
									.catch((_) => {
										message.channel.send(
											`${Emotes.actions.cancel} Canceling the operation.`
										);
									});
							});
						}
					);
				} else return message.channel.send(":lock: Missing permission");
			}
		);
	},
};

async function Perfom_Action(
	client,
	message,
	emote,
	action,
	actionText,
	target
) {
	message.channel.send(`${emote} Reason for the **${action}**?`);
	let reason = "";

	await message.channel
		.awaitMessages((m) => m.author.id == message.author.id, {
			max: 1,
			time: 30000,
		})
		.then(async (collected) => {
			reason = await collected.first().content;
		})
		.catch(() => {
			message.reply("No reason given.");
			reason = "No reason given.";
		});

	switch (action) {
		case "Warn":
			if (
				!(await Moderation.Warn(
					client,
					message.guild.id,
					target.id,
					message.author,
					reason
				))
			)
				return message.channel.send(
					`Unable to warn <@${target.id}> \`\`(${target.id})\`\`.`
				);
			break;

		case "Kick":
			if (
				!(await Moderation.Kick(
					client,
					message.guild.id,
					target.id,
					message.author,
					reason
				))
			)
				return message.channel.send(
					`Unable to kick <@${target.id}> \`\`(${target.id})\`\`.`
				);
			break;
		case "Ban":
			if (
				!(await Moderation.Ban(
					client,
					message.guild.id,
					target.id,
					message.author,
					reason
				))
			)
				return message.channel.send(
					`Unable to ban <@${target.id}> \`\`(${target.id})\`\`.`
				);
			break;
		default:
			message.channel.send("Something went wrong");
			break;
	}

	await SendLog.Mod_action(
		client,
		message.guild.id,
		`${emote} ${action} **${target.username}**#${target.discriminator} \`\`(${target.id})\`\` by **${message.author.username}**#${message.author.discriminator} \`\`(${message.author.id})\`\` \n**Reason:** ${reason} `,
		""
	);

	message.channel.send(
		`${actionText} <@${target.id}> \`\`(${target.id})\`\` for \`\`${reason}\`\``
	);
}
