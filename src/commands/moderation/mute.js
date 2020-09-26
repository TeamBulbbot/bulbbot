const Moderation = require("../../handlers/Moderation");
const Emotes = require("../../emotes.json");
const SendLog = require("../../handlers/SendLog");
const Role = require("../../models/role");
const moment = require("moment");

module.exports = {
	name: "mute",
	category: "moderation",
	description: "Mutes a user from the guild",
	run: async (client, message, args) => {
		Role.findOne(
			{
				guildID: message.guild.id,
			},
			async (err, roles) => {
				if (
					message.member.roles.cache.has(roles.moderator) ||
					message.member.hasPermission("KICK_MEMBERS")
				) {
					if (roles.mute === "")
						return message.channel.send(
							"Unable to find a muted role in this server, please add one by doing ``configure|cfg|setting|config mute <mutedRole>``"
						);

					if (args[0] === undefined || args[0] === null)
						return message.channel.send(
							`${Emotes.actions.warn} Missing required argument \`\`user\`\`\n${Emotes.other.tools} Correct usage of command: \`\`mute <user> <duration> [reason]\`\`\n**Duration:** \`\`w = week\`\`, \`\`d = day\`\`, \`\`h = hour\`\`, \`\`m = minutes\`\`, \`\`s = seconds\`\``
						);
					if (args[1] === undefined || args[1] === null)
						return message.channel.send(
							`${Emotes.actions.warn} Missing required argument \`\`duration\`\`\n${Emotes.other.tools} Correct usage of command: \`\`mute <user> <duration> [reason]\`\`\n**Duration:** \`\`w = week\`\`, \`\`d = day\`\`, \`\`h = hour\`\`, \`\`m = minutes\`\`, \`\`s = seconds\`\``
						);

					let target = args[0].replace(/\D/g, ""); // Remove everything except numbers
					let user = message.guild.member(target);
					let reason = args.slice(2).join(" ");
					if (reason === "") reason = "No reason given";
					if (user === null)
						return message.channel.send("User is not in server");

					if (user.roles.cache.has(roles.mute))
						return message.channel.send(
							`**${user.user.username}** is currently muted.`
						);

					const duration = args[1];
					let unixDuration = duration;

					switch (duration.substr(duration.length - 1)) {
						case "w":
							unixDuration = unixDuration.substring(0, unixDuration.length - 1);
							unixDuration = moment().add(unixDuration, "weeks").unix();
							break;
						case "d":
							unixDuration = unixDuration.substring(0, unixDuration.length - 1);
							unixDuration = moment().add(unixDuration, "days").unix();
							break;
						case "h":
							unixDuration = unixDuration.substring(0, unixDuration.length - 1);
							unixDuration = moment().add(unixDuration, "hours").unix();
							break;
						case "m":
							unixDuration = unixDuration.substring(0, unixDuration.length - 1);
							unixDuration = moment().add(unixDuration, "minutes").unix();
							break;
						case "s":
							unixDuration = unixDuration.substring(0, unixDuration.length - 1);
							unixDuration = moment().add(unixDuration, "seconds").unix();
							break;

						default:
							return message.channel.send(
								`${Emotes.actions.warn} Invalid \`\`duration\`\`\n${Emotes.other.tools} Correct usage of command: \`\`mute <user> <duration> [reason]\`\`\n**Duration:** \`\`w = week\`\`, \`\`d = day\`\`, \`\`h = hour\`\`, \`\`m = minutes\`\`, \`\`s = seconds\`\``
							);
					}

					if (
						!(await Moderation.Mute(
							client,
							message.guild.id,
							target,
							message.author,
							reason,
							unixDuration,
							duration
						))
					)
						return message.channel.send(
							`Unable to mute <@${target}> \`\`(${target})\`\`.`
						);

					user.roles.add(roles.mute).catch(console.error);

					await SendLog.Mod_action(
						client,
						message.guild.id,
						`${Emotes.actions.mute} Muting **${user.user.username}**#${user.user.discriminator} \`\`(${user.user.id})\`\` by **${message.author.username}**#${message.author.discriminator} \`\`(${message.author.id})\`\` \n**Reason:** ${reason}\n**Duration:** ${duration} `,
						""
					);

					message.channel.send(
						`${Emotes.actions.mute} Muting <@${target}> \`\`(${target})\`\` for \`\`${reason}\`\` for **${duration}**`
					);
				} else return message.channel.send(":lock: Missing permission");
			}
		);
	},
};
