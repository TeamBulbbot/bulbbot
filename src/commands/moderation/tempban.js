const parse = require("parse-duration");

const Log = require("../../utils/moderation/log");
const Moderation = require("../../utils/moderation/moderation");
const Translator = require("../../utils/lang/translator")
const Global = require("../../utils/database/global")

module.exports = {
	name: "tempban",
	aliases: ["tempyeet"],
	category: "moderation",
	description: "Bans a user from the guild",
	usage: "tempban <user> <duration> [reason]",
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
				Translator.Translate("tempban_missing_arg_user")
			);
		if (args[1] === undefined || args[1] === null)
			return message.channel.send(
				Translator.Translate("tempban_missing_arg_duration")
			);

		let target = args[0].replace(/\D/g, "");
		let duration = parse(args[1]);
		let reason = args.slice(2).join(" ");
		const infID = await Global.NumberInfraction();
		if (reason === "") reason = "No reason given";

		let user = message.guild.member(target);

		if (user == null) {
			return message.channel.send(Translator.Translate("global_user_not_found"));
		}

		if (duration < parse("1s")) {
			return message.channel.send(
				Translator.Translate("tempban_invalid_duration_second")
			);
		} else if (duration > parse("1y")) {
			return message.channel.send(
				Translator.Translate("tempban_invalid_duration_year")
			);
		}

		if (
			!(await Moderation.Tempban(
				client,
				message.guild.id,
				target,
				message.author,
				reason,
				args[1],
				Math.floor(new Date().getTime() / 1000) + duration / 1000
			))
		)
			return message.channel.send(
				Translator.Translate("ban_fail", {
					user: user.user.username,
					user_discriminator: user.user.discriminator,
					user_id: user.user.id,
				})
			);

		await Log.Mod_action(
			client,
			message.guild.id,
			Translator.Translate("tempban_log", {
				user: user.user.username,
				user_discriminator: user.user.discriminator,
				user_id: user.user.id,
				moderator: message.author.username,
				moderator_discriminator: message.author.discriminator,
				moderator_id: message.active.id,
				reason: reason,
				time: args[1],
				inf_number: infID
			}),
			""
		);
		message.channel.send(
			Translator.Translate("tempban_success", {
				user: user.user.username,
				user_discriminator: user.user.discriminator,
				user_id: user.user.id,
				reason: reason,
				time: args[1],
				inf_number: infID
			})
		);
	},
};
