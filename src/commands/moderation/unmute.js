const Guild = require("../../models/guild");
const Log = require("../../utils/moderation/log");
const Logger = require("../../utils/other/winston");
const Global = require("../../utils/database/global")
const Translator = require("../../utils/lang/translator")

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
	userPermissions: ["BAN_MEMBERS", "MANAGE_GUILD"],
	clearanceLevel: 50,
	run: async (client, message, args) => {
		Guild.findOne(
			{
				guildID: message.guild.id,
			},
			async (err, fGuild) => {
				if (fGuild.roles.mute === "")
					return message.channel.send(
						Translator.Translate("mute_mute_role_not_found")
					);

				if (args[0] === undefined || args[0] === null)
					return message.channel.send(
						Translator.Translate("unmute_missing_arg_user")
					);

				let target = args[0].replace(/\D/g, ""); // Remove everything except numbers
				let user = message.guild.member(target);
				let reason = args.slice(2).join(" ");
				const infID = await Global.NumberInfraction();
				if (reason === "") reason = "No reason given";
				if (user === null) return message.channel.send(Translator.Translate("global_user_not_found", {user: target}));

				if (user.roles.cache.has(fGuild.roles.mute)) {
					user.roles
						.remove(fGuild.roles.mute)
						.catch((err) => Logger.error(err));

					await Log.Mod_action(
						client,
						message.guild.id,
						Translator.Translate("unmute_log", {
							user: user.user.username,
							user_discriminator: user.user.discriminator,
							user_id: user.user.id,
							moderator: message.author.username,
							moderator_discriminator: message.author.discriminator,
							moderator_id: message.author.id,
							reason: reason,
							inf_number: infID
						}),
						""
					);

					message.channel.send(
						Translator.Translate("unmute_success", {
							user: user.user.username,
							user_discriminator: user.user.discriminator,
							user_id: user.user.id,
							reason: reason,
							inf_number: infID
						})
					);
				} else
					return message.channel.send(
						Translator.Translate("unmute_fail", {
							user: user.user.username,
							user_discriminator: user.user.discriminator,
							user_id: user.user.id
						})
					);
			}
		);
	},
};
