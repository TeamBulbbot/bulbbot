import { ContextMenuInteraction, GuildMember, Message, Snowflake } from "discord.js";
import InfractionsManager from "../../utils/managers/InfractionsManager";
import BulbBotClient from "../../structures/BulbBotClient";

const infractionsManager: InfractionsManager = new InfractionsManager();

export default async function (client: BulbBotClient, interaction: ContextMenuInteraction, message: Message): Promise<void> {
	const infID = await infractionsManager.warn(
		client,
		<Snowflake>interaction.guild?.id,
		<GuildMember>await interaction.guild?.members.fetch(message.author.id),
		<GuildMember>interaction.member,
		await client.bulbutils.translate("global_mod_action_log", message.guild?.id, {
			action: await client.bulbutils.translate("mod_action_types.warn", message.guild?.id, {}),
			moderator: interaction.user,
			target: message.author,
			reason: await client.bulbutils.translate("global_no_reason", interaction.guild?.id, {}),
		}),
		await client.bulbutils.translate("global_no_reason", interaction.guild?.id, {}),
	);

	await interaction.reply({
		content: await client.bulbutils.translate("action_success", interaction.guild?.id, {
			action: await client.bulbutils.translate("mod_action_types.warn", interaction.guild?.id, {}),
			target: message.author,
			moderator: interaction.user,
			reason: await client.bulbutils.translate("global_no_reason", interaction.guild?.id, {}),
			infraction_id: infID,
		}),
		ephemeral: true,
	});
}