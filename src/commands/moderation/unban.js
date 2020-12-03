const Moderation = require("../../utils/moderation/moderation");
const Log = require("../../utils/moderation/log");
const Emotes = require("../../emotes.json");
const Global = require("../../utils/database/global")
const Translator = require("../../utils/lang/translator")

module.exports = {
	name: "unban",
	aliases: ["pardon"],
	category: "moderation",
	description: "Unban a user from the server",
	usage: "unban <user> [reason]",
	clientPermissions: [
		"SEND_MESSAGES",
		"VIEW_CHANNEL",
		"MANAGE_MESSAGES",
		"USE_EXTERNAL_EMOJIS",
		"BAN_MEMBERS",
	],
	userPermissions: ["BAN_MEMBERS", "MANAGE_GUILD"],
	clearanceLevel: 50,
	run: async (client, message, args) => {
		if (args[0] === undefined || args[0] === null)
			return message.channel.send(
				Translator.Translate("unban_missing_arg_user")
			);
		let target = args[0];
		let reason = args.slice(1).join(" ");
		const infID = await Global.NumberInfraction();
		if (reason === "") reason = "No reason given";

		let whoToUnban = "";

		message.guild.fetchBans().then(async (bans) => {
			bans.forEach((ban) => {
				// Check for id
				if (ban.user.id === target) whoToUnban = ban.user.id;

				// Check for username
				if (ban.user.username.toLowerCase().includes(target.toLowerCase()))
					whoToUnban = ban.user.id;
			});

			if (whoToUnban === "")
				return message.channel.send(
					Translator.Translate("unban_fail", {
						user: target
					})
				);

			const user = await client.users.fetch(whoToUnban);

			message.channel
				.send(
					Translator.Translate("unban_confirm", {
						user: user.username,
						user_discriminator: user.discriminator,
						user_id: user.id
					})
				)
				.then((msg) => {
					msg
						.react(Emotes.actions.confirm.replace(/\D/g, "")) // Confrim
						.then(() => msg.react(Emotes.actions.cancel.replace(/\D/g, ""))); // Cancel

					const filter = (reaction, user) => {
						return (
							[
								Emotes.actions.confirm.replace(/\D/g, ""),
								Emotes.actions.cancel.replace(/\D/g, ""),
							].includes(reaction.emoji.id) && user.id === message.author.id
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
								reaction.emoji.id === Emotes.actions.confirm.replace(/\D/g, "")
							) {
								if (
									!(await Moderation.Unban(
										client,
										message.guild.id,
										user,
										message.author,
										reason
									))
								)
									return message.channel.send(
										Translator.Translate("unban_fail_2", {
											user: user.username,
											user_discriminator: user.discriminator,
											user_id: user.id
										})
									);
								await Log.Mod_action(
									client,
									message.guild.id,
									Translator.Translate("unban_log", {
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

								return message.channel.send(
									Translator.Translate("unban_success", {
										user: user.username,
										user_discriminator: user.discriminator,
										user_id: user.id,
										reason: reason,
										inf_number: infID
									})
								);
							} else {
								return message.channel.send(
									Translator.Translate("global_operation_cancel")
								);
							}
						});
				});
		});
	},
};
