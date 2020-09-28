const Emotes = require("../../emotes.json");
const SendLog = require("../../handlers/SendLog");
const Role = require("../../models/role");

module.exports = {
	name: "unmute",
	category: "moderation",
	description: "Unmutes a user from the guild",
	usage: "unmute <user> [reason]",
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
							`${Emotes.actions.warn} Missing required argument \`\`user\`\`\n${Emotes.other.tools} Correct usage of command: \`\`unmute <user> [reason]\`\``
						);

					let target = args[0].replace(/\D/g, ""); // Remove everything except numbers
					let user = message.guild.member(target);
					let reason = args.slice(2).join(" ");
					if (reason === "") reason = "No reason given";
					if (user === null)
						return message.channel.send("User is not in server");

					if (user.roles.cache.has(roles.mute)) {
						user.roles.remove(roles.mute).catch(console.error);

						await SendLog.Mod_action(
							client,
							message.guild.id,
							`${Emotes.actions.unban} Unmuting **${user.user.username}**#${user.user.discriminator} \`\`(${user.user.id})\`\` by **${message.author.username}**#${message.author.discriminator} \`\`(${message.author.id})\`\` \n**Reason:** ${reason} `,
							""
						);

						message.channel.send(
							`${Emotes.actions.unban} Unmuting <@${target}> \`\`(${target})\`\` for \`\`${reason}\`\``
						);
					} else
						return message.channel.send(
							`**${user.user.username}** is currently not muted.`
						);
				} else return message.channel.send(":lock: Missing permission");
			}
		);
	},
};
