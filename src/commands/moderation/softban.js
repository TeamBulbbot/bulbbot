const Moderation = require("../../utils/moderation/moderation");
const Log = require("../../utils/moderation/log");
const Global = require("../../utils/database/global")
const Translator = require("../../utils/lang/translator")

module.exports = {
	name: "softban",
	aliases: ["cleanban"],
	category: "moderation",
	description: "Bans and unbans a user from a guild clearing their messages",
	usage: "softban <user> [reason]",
	clientPermissions: [
		"SEND_MESSAGES",
		"VIEW_CHANNEL",
		"BAN_MEMBERS",
		"USE_EXTERNAL_EMOJIS",
	],
	userPermissions: ["BAN_MEMBERS", "MANAGE_GUILD"],
	clearanceLevel: 50,
	run: async (client, message, args) => {
		if (args[0] === undefined || args[0] === null)
			return message.channel.send(
				Translator.Translate("softban_missing_arg_user")
			);
		let target = args[0].replace(/\D/g, ""); // Remove everything except numbers
		let user = message.guild.member(target);
		let reason = args.slice(1).join(" ");
		const infID = await Global.NumberInfraction();
		if (reason === "") reason = "No reason given";
		if (user === null) {
			return message.channel.send(Translator.Translate("global_user_not_found", {
				user: target
			}));
		} else {
			if (
				!(await Moderation.Softban(
					client,
					message.guild.id,
					target,
					message.author,
					reason
				))
			)
				return message.channel.send(
					Translator.Translate("softban_fail", {
						user: user.user.username,
						user_discriminator: user.user.discriminator,
						user_id: user.user.id
					})
				);
			user = user.user;
		}

		await Log.Mod_action(
			client,
			message.guild.id,
			Translator.Translate("softban_log", {
				user: user.username,
				user_discriminator: user.discriminator,
				user_id: user.id,
				moderator: message.author.username,
				moderator_discriminator: message.author.discriminator,
				moderator_id: message.author.id,
				reason: reason,
				inf_number: infID
			}),
			""
		);

		message.channel.send(
			Translator.Translate("softban_success", {
				user: user.username,
				user_discriminator: user.discriminator,
				user_id: user.id,
				reason: reason,
				inf_number: infID
			})
		);
	},
};
