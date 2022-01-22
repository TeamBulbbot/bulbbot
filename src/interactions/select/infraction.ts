import { NonDigits, ReasonImage } from "../../utils/Regex";
import { MessageEmbed, SelectMenuInteraction, Snowflake } from "discord.js";
import moment from "moment";
import * as Emotes from "../../emotes.json";
import { embedColor } from "../../Config";
import BulbBotClient from "../../structures/BulbBotClient";
import InfractionsManager from "../../utils/managers/InfractionsManager";
import { Infraction } from "../../utils/types/DatabaseStructures";

const infractionsManager: InfractionsManager = new InfractionsManager();

export default async function (client: BulbBotClient, interaction: SelectMenuInteraction): Promise<void> {
	const infID = Number(interaction.values[0].replace(NonDigits, ""));
	const inf: Infraction = <Infraction>await infractionsManager.getInfraction(<Snowflake>interaction.guild?.id, infID);

	if (!inf)
		return interaction.reply({
			content: await client.bulbutils.translate("infraction_not_found", interaction.guild?.id, {
				infraction_id: infID,
			}),
			ephemeral: true,
		});

	const user = await client.bulbutils.userObject(false, await client.users.fetch(inf.targetId));
	const target: Record<string, string> = { tag: inf.target, id: inf.targetId };
	const moderator: Record<string, string> = { tag: inf.moderator, id: inf.moderatorId };

	let description: string = "";
	description += await client.bulbutils.translate("infraction_info_inf_id", interaction.guild?.id, { infraction_id: inf.id });
	description += await client.bulbutils.translate("infraction_info_target", interaction.guild?.id, { target });
	description += await client.bulbutils.translate("infraction_info_moderator", interaction.guild?.id, { moderator });
	description += await client.bulbutils.translate("infraction_info_created", interaction.guild?.id, {
		created: moment(Date.parse(inf.createdAt)).format("MMM Do YYYY, h:mm:ss a"),
	});

	if (inf.active !== "false" && inf.active !== "true") {
		description += await client.bulbutils.translate("infraction_info_expires", interaction.guild?.id, {
			expires: `${Emotes.status.ONLINE} ${moment(parseInt(inf.active)).format("MMM Do YYYY, h:mm:ss a")}`,
		});
	} else {
		description += await client.bulbutils.translate("infraction_info_active", interaction.guild?.id, {
			active: client.bulbutils.prettify(inf.active),
		});
	}

	description += await client.bulbutils.translate("infraction_info_reason", interaction.guild?.id, { reason: inf.reason });

	const image = inf.reason.match(ReasonImage);

	const embed: MessageEmbed = new MessageEmbed()
		.setTitle(client.bulbutils.prettify(inf.action))
		.setDescription(description)
		.setColor(embedColor)
		.setImage(<string>(image ? image[0] : null))
		.setThumbnail(user.avatarUrl)
		.setFooter({
			text: await client.bulbutils.translate("global_executed_by", interaction.guild?.id, { user: interaction.user }),
			iconURL: <string>interaction.user.avatarURL({ dynamic: true }),
		})
		.setTimestamp();

	await interaction.reply({ embeds: [embed], ephemeral: true });
}
