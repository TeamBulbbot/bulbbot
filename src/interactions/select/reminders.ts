import BulbBotClient from "../../structures/BulbBotClient";
import { MessageEmbed, SelectMenuInteraction } from "discord.js";
import ReminderManager from "../../utils/managers/ReminderManager";
import { embedColor } from "../../Config";
import moment from "moment";

const { getReminder } = new ReminderManager();

export default async function (client: BulbBotClient, interaction: SelectMenuInteraction): Promise<void> {
	const ID: number = Number(interaction.values[0].split("_")[1]);
	const user: string = interaction.values[0].split("_")[0];
	const reminder: Record<string, any> = await getReminder(ID);

	if (!reminder) return interaction.reply({ content: await client.bulbutils.translate("remind_not_found", interaction.guild?.id, {}), ephemeral: true });

	if (user !== interaction.user.id) return await interaction.reply({ content: await client.bulbutils.translate("remind_no_permissions", interaction.guild?.id, {}), ephemeral: true });
	if (!reminder) return await interaction.reply({ content: await client.bulbutils.translate("remind_not_found", interaction.guild?.id, {}), ephemeral: true });

	let desc: string = "";
	desc += await client.bulbutils.translate("remind_desc_reason", interaction.guild?.id, { reminder });
	desc += await client.bulbutils.translate("remind_desc_expire", interaction.guild?.id, { reminder });
	desc += await client.bulbutils.translate("remind_desc_created", interaction.guild?.id, {
		createdAt: moment(reminder.createdAt).unix(),
		message: `https://discord.com/channels/${interaction.guild?.id}/${reminder.channelId}/${reminder.messageId}`,
	});

	const embed: MessageEmbed = new MessageEmbed()
		.setColor(embedColor)
		.setAuthor({
			name: await client.bulbutils.translate("remind_desc_header", interaction.guild?.id, { reminder }),
		})
		.setDescription(desc)
		.setFooter({
			text: await client.bulbutils.translate("global_executed_by", interaction.guild?.id, {
				user: interaction.user,
			}),
			iconURL: <string>interaction.user.avatarURL({ dynamic: true }),
		})
		.setTimestamp();

	await interaction.reply({ embeds: [embed], ephemeral: true });
}
