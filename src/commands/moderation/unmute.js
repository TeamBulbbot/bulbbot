const Emotes = require("../../emotes.json");
const Log = require("../../utils/moderation/log");
const Guild = require("../../models/guild");
const Logger = require("../../utils/other/winston");

module.exports = {
	name: "unmute",
	category: "moderation",
	description: "Unmutes a user from the guild",
	usage: "unmute <user> [reason]",
	clientPermissions: [
		"SEND_MESSAGES",
		"VIEW_CHANNEL",
		"MANAGE_ROLES",
		"USE_EXTERNAL_EMOJIS",
	],
	clearanceLevel: 50,
	run: async (client, message, args) => {
		Guild.findOne(
			{
				guildID: message.guild.id,
			},
			async (err, fGuild) => {
				if (fGuild.roles.mute === "")
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
				if (user === null) return message.channel.send("User is not in server");

				if (user.roles.cache.has(fGuild.roles.mute)) {
					user.roles
						.remove(fGuild.roles.mute)
						.catch((err) => Logger.error(err));

					await Log.Mod_action(
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
			}
		);
	},
};
