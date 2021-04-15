const { getInfraction } = require("../../../utils/InfractionUtils");
const { ReasonImage, NonDigits } = require("../../../utils/Regex");

const Emotes = require("../../../emotes.json");

const moment = require("moment");
const Discord = require("discord.js");

module.exports = {
	Call: async (client, message, args) => {
		if (!args[1])
			return message.channel.send(
				await client.bulbutils.translate("event_message_args_missing", message.guild.id, {
					arg: "infraction:int",
					arg_expected: 2,
					arg_provided: 1,
					usage: "!infraction info <infraction>",
				}),
			);

		const inf = await getInfraction(message.guild.id, args[1].replace(NonDigits, ""));

		if (!inf) {
			return message.channel.send(
				await client.bulbutils.translate("infraction_not_found", message.guild.id, {
					infractionId: args[1].replace(NonDigits, ""),
				}),
			);
		}

		const user = await client.bulbutils.userObject(false, await client.users.fetch(inf.targetId));

		let description = "";
		description += await client.bulbutils.translate("infraction_info_inf_id", message.guild.id, { infractionId: args[1] });
		description += await client.bulbutils.translate("infraction_info_target", message.guild.id, {
			target_tag: inf.target,
			target_id: inf.targetId,
		});
		description += await client.bulbutils.translate("infraction_info_moderator", message.guild.id, {
			moderator_tag: inf.moderator,
			moderator_id: inf.moderatorId,
		});
		description += await client.bulbutils.translate("infraction_info_created", message.guild.id, {
			timestamp: moment(Date.parse(inf.createdAt)).format("MMM Do YYYY, h:mm:ss a"),
		});

		if (inf.active !== "false" && inf.active !== "true") {
			description += await client.bulbutils.translate("infraction_info_expires", message.guild.id, {
				timestamp: `${Emotes.status.ONLINE} ${moment(parseInt(inf.active)).format("MMM Do YYYY, h:mm:ss a")}`,
			});
		} else {
			description += await client.bulbutils.translate("infraction_info_active", message.guild.id, {
				emoji: prettify(inf.active),
			});
		}

		description += await client.bulbutils.translate("infraction_info_reason", message.guild.id, {
			reason: inf.reason,
		});

		const image = inf.reason.match(ReasonImage);

		const embed = new Discord.MessageEmbed()
			.setTitle(prettify(inf.action))
			.setDescription(description)
			.setColor(process.env.EMBED_COLOR)
			.setImage(image ? image[0] : null)
			.setThumbnail(user.avatarUrl)
			.setFooter(
				await client.bulbutils.translate("global_executed_by", message.guild.id, {
					user_name: message.author.username,
					user_discriminator: message.author.discriminator,
				}),
				message.author.avatarURL(),
			)
			.setTimestamp();

		message.channel.send(embed);
	},
};

function prettify(action) {
	let finalString = "";
	switch (action) {
		case "Ban":
			finalString = `${Emotes.actions.BAN} Ban`;
			break;
		case "Forceban":
			finalString = `${Emotes.actions.BAN} Forceban`;
			break;
		case "Kick":
			finalString = `${Emotes.actions.KICK} Kick`;
			break;
		case "Mute":
			finalString = `${Emotes.actions.MUTE} Mute`;
			break;
		case "Warn":
			finalString = `${Emotes.actions.WARN} Warn`;
			break;
		case "Unmute":
			finalString = `${Emotes.actions.UNBAN} Unmute`;
			break;
		case "Unban":
			finalString = `${Emotes.actions.UNBAN} Unban`;
			break;
		case "true":
			finalString = `${Emotes.status.ONLINE} True`;
			break;
		case "false":
			finalString = `${Emotes.other.INF2} False`;
			break;
	}

	return finalString;
}
