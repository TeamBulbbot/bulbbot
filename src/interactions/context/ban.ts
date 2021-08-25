import { ContextMenuInteraction, Guild, GuildMember, Message } from "discord.js";
import { BanType } from "../../utils/types/BanType";
import BulbBotClient from "../../structures/BulbBotClient";
import InfractionsManager from "../../utils/managers/InfractionsManager";

const infractionsManager: InfractionsManager = new InfractionsManager();

export default async function (client: BulbBotClient, interaction: ContextMenuInteraction, message: Message): Promise<void> {
	const infID = await infractionsManager.ban(
		client,
		<Guild>interaction.guild,
		BanType.CLEAN,
		message.author,
		<GuildMember>interaction.member,
		await client.bulbutils.translate("global_mod_action_log", message.guild?.id, {
			action: await client.bulbutils.translate("mod_action_types.ban", message.guild?.id, {}),
			moderator: interaction.user,
			target: message.author,
			reason: await client.bulbutils.translate("global_no_reason", interaction.guild?.id, {}),
		}),
		await client.bulbutils.translate("global_no_reason", interaction.guild?.id, {}),
	);

	await interaction.reply({
		content: await client.bulbutils.translate("action_success", interaction.guild?.id, {
			action: await client.bulbutils.translate("mod_action_types.ban", interaction.guild?.id, {}),
			target: message.author,
			moderator: interaction.user,
			reason: await client.bulbutils.translate("global_no_reason", interaction.guild?.id, {}),
			infraction_id: infID,
		}),
		ephemeral: true,
	});
}