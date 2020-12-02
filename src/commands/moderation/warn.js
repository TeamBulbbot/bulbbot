const Moderation = require("../../utils/moderation/moderation");
const Log = require("../../utils/moderation/log");
const Translator = require("../../utils/lang/translator")
const Global = require("../../utils/database/global")

module.exports = {
	name: "warn",
	category: "moderation",
	description: "Warns a user inside of guild",
	usage: "warn <user> [reason]",
	clientPermissions: ["SEND_MESSAGES", "VIEW_CHANNEL", "USE_EXTERNAL_EMOJIS"],
	userPermissions: ["BAN_MEMBERS", "KICK_MEMBERS", "MANAGE_GUILD"],
	clearanceLevel: 50,
	run: async (client, message, args) => {
		if (args[0] === undefined || args[0] === null)
			return message.channel.send(
				Translator.Translate("warn_missing_arg_user")
			);
		let target = args[0].replace(/\D/g, ""); // Remove everything except numbers
		let user = message.guild.member(target);
		let reason = args.slice(1).join(" ");
		let inf_ID = await Global.NumberInfraction();
		if (reason === "") reason = "No reason given";
		if (user === null) return message.channel.send(
			Translator.Translate("global_user_not_found", {
				user: target
			}));

		await Moderation.Warn(
			client,
			message.guild.id,
			target,
			message.author,
			reason
		);

		await Log.Mod_action(
			client,
			message.guild.id,
			Translator.Translate("warn_log", {
				user: user.user.username,
				user_discriminator: user.user.discriminator,
				user_id: user.user.id,
				moderator: message.author.username,
				moderator_discriminator: message.author.discriminator,
				moderator_id: message.author.id,
				reason: reason,
				inf_number: inf_ID
			}),
			""
		);

		message.channel.send(
			Translator.Translate("warn_success", {
				user: user.user.username,
				user_discriminator: user.user.discriminator,
				user_id: user.user.id,
				reason: reason
			})
		);
	},
};
