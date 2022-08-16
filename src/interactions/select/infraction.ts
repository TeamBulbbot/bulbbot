import { NonDigits, ReasonImage } from "../../utils/Regex";
import { MessageEmbed, SelectMenuInteraction } from "discord.js";
import moment from "moment";
import * as Emotes from "../../emotes.json";
import { embedColor } from "../../Config";
import BulbBotClient from "../../structures/BulbBotClient";
import InfractionsManager from "../../utils/managers/InfractionsManager";

const infractionsManager: InfractionsManager = new InfractionsManager();

export default async function (client: BulbBotClient, interaction: SelectMenuInteraction): Promise<void> {
	if (!interaction.guild) return;
	const infID = Number(interaction.values[0].replace(NonDigits, ""));
	const inf = await infractionsManager.getInfraction(interaction.guild.id, infID);

	if (!inf)
		return interaction.reply({
			content: await client.bulbutils.translate("infraction_not_found", interaction.guild.id, {
				infraction_id: infID,
			}),
			ephemeral: true,
		});

	const user = client.bulbutils.userObject(false, await client.users.fetch(inf.targetId));
	const target = { tag: inf.target, id: inf.targetId };
	const moderator = { tag: inf.moderator, id: inf.moderatorId };

	let description = "";
	description += await client.bulbutils.translate("infraction_info_inf_id", interaction.guild.id, { infraction_id: inf.id });
	description += await client.bulbutils.translate("infraction_info_target", interaction.guild.id, { target });
	description += await client.bulbutils.translate("infraction_info_moderator", interaction.guild.id, { moderator });
	description += await client.bulbutils.translate("infraction_info_created", interaction.guild.id, {
		created: moment(inf.createdAt).format("MMM Do YYYY, h:mm:ss a"),
	});

	if (inf.timeout) {
		description += await client.bulbutils.translate("infraction_info_expires", interaction.guild.id, {
			expires: `${Emotes.status.ONLINE} ${moment(parseInt(inf.timeout)).format("MMM Do YYYY, h:mm:ss a")}`,
		});
	}

	description += await client.bulbutils.translate("infraction_info_reason", interaction.guild.id, { reason: inf.reason });
	description += await client.bulbutils.translate("infraction_info_active", interaction.guild.id, { active: client.bulbutils.prettify(`${inf.active}`) });

	const image = inf.reason.match(ReasonImage);

	const embed: MessageEmbed = new MessageEmbed()
		.setTitle(client.bulbutils.prettify(inf.action))
		.setDescription(description)
		.setColor(embedColor)
		.setImage(image ? image[0] : "")
		.setThumbnail(user?.avatarUrl || "")
		.setFooter({
			text: await client.bulbutils.translate("global_executed_by", interaction.guild.id, { user: interaction.user }),
			iconURL: interaction.user.avatarURL({ dynamic: true }) ?? undefined,
		})
		.setTimestamp();

	await interaction.reply({ embeds: [embed], ephemeral: true });
}
