const { getAllInfractions } = require("../../../utils/InfractionUtils");
const { ReasonImage } = require("../../../utils/Regex");

const Emotes = require("../../../emotes.json");

const moment = require("moment");
const Discord = require("discord.js");
const embedPagination = require("discord.js-pagination")

module.exports = {
	Call: async (client, message) => {
		let pages = [];

		const infs = await getAllInfractions(message.guild.id);
		for (let i = 0; i < 50; i++) {
			if (infs[i] === undefined) continue;

			let description = "";
			description += client.bulbutils.translate("infraction_info_inf_id", { infractionId: infs[i].id });
			description += client.bulbutils.translate("infraction_info_target", {
				target_tag: infs[i].target,
				target_id: infs[i].targetId,
			});
			description += client.bulbutils.translate("infraction_info_moderator", {
				moderator_tag: infs[i].moderator,
				moderator_id: infs[i].moderatorId,
			});
			description += client.bulbutils.translate("infraction_info_created", {
				timestamp: moment(Date.parse(infs[i].createdAt)).format("MMM Do YYYY, h:mm:ss a"),
			});

			if (infs[i].active !== "false" && infs[i].active !== "true") {
				description += client.bulbutils.translate("infraction_info_expires", {
					timestamp: `${Emotes.status.ONLINE} ${moment(parseInt(infs[i].active)).format("MMM Do YYYY, h:mm:ss a")}`,
				});
			} else {
				description += client.bulbutils.translate("infraction_info_active", {
					emoji: prettify(infs[i].active),
				});
			}

			description += client.bulbutils.translate("infraction_info_reason", {
				reason: infs[i].reason,
			});

			const image = infs[i].reason.match(ReasonImage);
			const user = await client.bulbutils.userObject(false, await client.users.fetch(infs[i].targetId));

            const embed = new Discord.MessageEmbed()
                .setTitle(prettify(infs[i].action))
                .setDescription(description)
                .setColor(process.env.EMBED_COLOR)
                .setImage(image ? image[0] : null)
                .setThumbnail(user.avatarUrl)
                .setTimestamp();

            pages.push(embed)
		}

		if (pages.length === 0) {
			return message.channel.send(client.bulbutils.translate("infraction_list_not_found"));
		}

        await embedPagination(message, pages, ["⏪", "⏩"], 120000);
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
