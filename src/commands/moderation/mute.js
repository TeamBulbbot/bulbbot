const parse = require("parse-duration");

const Guild = require("../../models/guild");
const Moderation = require("../../utils/moderation/moderation");
const Log = require("../../utils/moderation/log");
const Logger = require("../../utils/other/winston");
const Translator = require("../../utils/lang/translator")
const Global = require("../../utils/database/global")

module.exports = {
	name: "mute",
	category: "moderation",
	description: "Mutes a user from the guild",
	usage: "mute <user> <duration> [reason]",
	clientPermissions: [
		"SEND_MESSAGES",
		"VIEW_CHANNEL",
		"MANAGE_ROLES",
		"USE_EXTERNAL_EMOJIS",
	],
	userPermissions: ["MANAGE_ROLES", "MANAGE_GUILD"],
	clearanceLevel: 50,
	run: async (client, message, args) => {
		Guild.findOne(
			{
				guildID: message.guild.id,
			},
			async (err, guild) => {
				if (guild.roles.mute === "")
					return message.channel.send(
						Translator.Translate("mute_mute_role_not_found")
					);

				if (args[0] === undefined || args[0] === null)
					return message.channel.send(
						Translator.Translate("mute_missing_arg_user")
					);
				if (args[1] === undefined || args[1] === null)
					return message.channel.send(
						Translator.Translate("mute_missing_arg_duration")
					);

				let target = args[0].replace(/\D/g, ""); // Remove everything except numbers
				let user = message.guild.member(target);

				const inf_ID = await Global.NumberInfraction();

				let reason = args.slice(2).join(" ");
				if (reason === "") reason = "No reason given";
				if (user === null) return message.channel.send(Translator.Translate("global_user_not_found", { user: target}));
				if (target === message.author.id) return message.channel.send(Translator.Translate("global_cannot_action_self"))

				if (
					user.roles.cache.has(guild.roles.mute) &&
					user.roles.cache.has(guild.roles.mute) !== null
				)
					return message.channel.send(
						Translator.Translate("mute_already_muted", {
							user: user.user.username,
							user_discriminator: user.user.discriminator,
							user_id: user.user.id
						})
					);

				const duration = args[1];
				let unixDuration = parse(duration);
				if (unixDuration < parse("1s"))
					return message.channel.send(
						Translator.Translate("mute_invalid_duration_second")
					);
				if (unixDuration > parse("1y"))
					return message.channel.send(
						Translator.Translate("mute_invalid_duration_year")
					);

				await Moderation.Mute(
					client,
					message.guild.id,
					target,
					message.author,
					reason,
					Math.floor(new Date().getTime() / 1000) + unixDuration / 1000,
					duration
				);

				user.roles.add(guild.roles.mute).catch((err) => Logger.error(err));

				await Log.Mod_action(
					client,
					message.guild.id,
					Translator.Translate("mute_muted_log", {
						user: user.user.username,
						user_discriminator: user.user.discriminator,
						user_id: user.user.id,
						moderator: message.author.username,
						moderator_discriminator: message.author.discriminator,
						moderator_id: message.author.id,
						reason: reason,
						time: args[1],
						inf_number: inf_ID
					}),
					""
				);

				message.channel.send(
					Translator.Translate("mute_muted", {
						user: user.user.username,
						user_discriminator: user.user.discriminator,
						user_id: user.user.id,
						moderator: message.author.username,
						moderator_discriminator: message.author.discriminator,
						moderator_id: message.author.id,
						time: args[1],
						inf_number: inf_ID
					})
				);
			}
		);
	},
};
