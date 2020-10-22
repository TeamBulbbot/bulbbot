const Moderation = require("../../utils/moderation/moderation");
const Emotes = require("../../emotes.json");
const Log = require("../../utils/moderation/log");
const Role = require("../../models/role");
const parse = require("parse-duration");

module.exports = {
	name: "mute",
	category: "moderation",
	description: "Mutes a user from the guild",
	usage: "mute <user> [reason]",
	clientPermissions: [
		"SEND_MESSAGES",
		"VIEW_CHANNEL",
		"MANAGE_ROLES",
		"USE_EXTERNAL_EMOJIS",
	],
	run: async (client, message, args) => {
		Role.findOne(
			{
				guildID: message.guild.id,
			},
			async (err, roles) => {
				if (
					message.member.roles.cache.has(roles.admin) ||
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
					let unixDuration = parse(duration);
					if (unixDuration < parse("1s"))
						return message.channel.send(
							`${Emotes.actions.warn} Invalid \`\`duration\`\`, the time can also not be shorter than 1 second \n${Emotes.other.tools} Correct usage of command: \`\`mute <user> <duration> [reason]\`\`\n**Duration:** \`\`w = week\`\`, \`\`d = day\`\`, \`\`h = hour\`\`, \`\`m = minutes\`\`, \`\`s = seconds\`\``
						);
					if (unixDuration > parse("1y"))
						return message.channel.send(
							`${Emotes.actions.warn} Invalid \`\`duration\`\`, the time can also not be longer than 1 year \n${Emotes.other.tools} Correct usage of command: \`\`mute <user> <duration> [reason]\`\`\n**Duration:** \`\`w = week\`\`, \`\`d = day\`\`, \`\`h = hour\`\`, \`\`m = minutes\`\`, \`\`s = seconds\`\``
						);

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

					await Log.Mod_action(
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
