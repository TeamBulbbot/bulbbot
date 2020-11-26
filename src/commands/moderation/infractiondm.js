const Translator = require("../../utils/lang/translator");
const Log = require("../../utils/moderation/log");

module.exports = {
	name: "infractiondm",
	aliases: ["infractionmessage", "infmsg", "infdm"],
	category: "moderation",
	description: "Get some basic information about the bot",
	usage: "infractiondm <user> <anonymous> <message>",
	clientPermissions: ["SEND_MESSAGES", "VIEW_CHANNEL"],
	userPermissions: [],
	clearanceLevel: 50,
	run: (client, message, args) => {
		let anonymous;

		if (args[0] === undefined || args[0] === null)
			return message.channel.send(
				Translator.Translate("infractiondm_missing_arg_user")
			);
		if (args[1] === undefined || args[1] === null)
			return message.channel.send(
				Translator.Translate("infractiondm_missing_arg_anonymous")
			);
		if (args[2] === undefined || args[2] === null)
			return message.channel.send(
				Translator.Translate("infractiondm_missing_arg_message")
			);

		if (args[1] !== "-p" && args[1] !== "-a")
			return message.channel.send(
				Translator.Translate("infractiondm_invalid_arg_anonymous", {
					new_value: args[1],
				})
			);

		anonymous = args[1] === "-a";

		let target = args[0].replace(/\D/g, "");
		let user = message.guild.member(target);
		let messageDM;

		if (user === null) {
			return message.channel.send(
				Translator.Translate("global_user_not_found", { user: args[1] })
			);
		}

		if (anonymous) {
			messageDM = `**Moderator from ${message.guild.name}**:\n`;
			messageDM += args.slice(2).join(" ");
		} else {
			messageDM = `**(Moderator) ${message.author.username} from ${message.guild.name}:**\n`;
			messageDM += args.slice(2).join(" ");
		}

		user.send(messageDM).catch((err) => {
			if (err)
				message.channel.send(
					Translator.Translate("infractiondm_failed", {
						user: user.user.username,
						user_id: user.id,
					})
				);
		});
		message.channel.send(
			Translator.Translate("infractiondm_sent", {
				user: user.user.username,
				user_id: user.id,
			})
		);

		return Log.Mod_action(
			message.client,
			message.guild.id,
			Translator.Translate("infractiondm_sent_log", {
				user: user.user.username,
				user_id: user.id,
				moderator: message.author.username,
				moderator_id: message.author.id,
				reason: args.slice(2).join(" "),
			}),
			""
		);
	},
};
