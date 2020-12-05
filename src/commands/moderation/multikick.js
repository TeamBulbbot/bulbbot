const Moderation = require("../../utils/moderation/moderation");
const Log = require("../../utils/moderation/log");
const Translator = require("../../utils/lang/translator")

module.exports = {
	name: "multikick",
	aliases: ["mkick"],
	category: "moderation",
	description: "Kicks a couple of users inside of guild",
	usage: "multikick <user> [user2]...[reason]",
	clientPermissions: ["SEND_MESSAGES", "VIEW_CHANNEL", "USE_EXTERNAL_EMOJIS"],
	userPermissions: ["BAN_MEMBERS", "KICK_MEMBERS", "MANAGE_GUILD"],
	clearanceLevel: 50,
	run: async (client, message, args) => {
		if (args[0] === undefined)
			return message.channel.send(
				Translator.Translate("mkick_missing_arg_users")
			);

		const targets = args
			.slice(0)
			.join(" ")
			.match(/<@?!?[0-9>]+|[0-9>]{17,}/g);
		let reason = args
			.slice(0)
			.join("")
			.replace(/<@?!?[0-9>]+|[0-9>]{17,}/g, "");
		if (reason === "") reason = "No reason given";
		let fullList = "";

		for (let i = 0; i < targets.length; i++) {
			const target = targets[i].replace(/\D/g, "");
			const t = await client.users.fetch(target);

			await Moderation.Kick(
				client,
				message.guild.id,
				target,
				message.author,
				reason
			);
			fullList += `**${t.username}**#${t.discriminator} \`\`(${t.id})\`\`, `;
		}

		await Log.Mod_action(
			client,
			message.guild.id,
			Translator.Translate("mkick_log", {
				new_value: fullList,
				reason: reason,
				moderator: message.author.username,
				moderator_discriminator: message.author.discriminator,
				moderator_id: message.author.id,
			}),
			""
		);
		message.channel.send(
			Translator.Translate("mkick_success", {
				new_value: fullList,
				reason: reason
			})
		);
	},
};
