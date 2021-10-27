import BulbBotClient from "../../structures/BulbBotClient";
import { ContextMenuInteraction, GuildMember, Message, MessageActionRow, MessageSelectMenu, MessageSelectOptionData, SelectMenuInteraction, Snowflake } from "discord.js";
import InfractionsManager from "../../utils/managers/InfractionsManager";

const infractionsManager: InfractionsManager = new InfractionsManager();

export default async function (client: BulbBotClient, interaction: ContextMenuInteraction, message: Message): Promise<void> {
	const target: GuildMember = <GuildMember>message.member
	const reasons: string[] = ["Spam", "Swearing", "Toxic behavior", "Advertising"];
	reasons.push(await client.bulbutils.translate("global_no_reason", interaction.guild?.id, {}));

	let options: MessageSelectOptionData[] = [];
	for (const reason of reasons) {
		options.push({ label: reason, value: reason });
	}

	const row: MessageActionRow = new MessageActionRow().addComponents(new MessageSelectMenu().setPlaceholder("Select a reason").setCustomId("warn").addOptions(options));

	await interaction.reply({
		content: await client.bulbutils.translate("userinfo_interaction_confirm", interaction.guild?.id, {
			target: target.user,
			action: await client.bulbutils.translate("mod_action_types.warn", interaction.guild?.id, {}),
		}),
		components: [row],
		ephemeral: true,
	});

	const collector = interaction.channel?.createMessageComponentCollector({ componentType: "SELECT_MENU", time: 30000 });

	collector?.on("collect", async (i: SelectMenuInteraction) => {
		if (interaction.user.id !== i.user.id) return;

		const infID = await infractionsManager.warn(
			client,
			<Snowflake>interaction.guild?.id,
			target.user,
			<GuildMember>interaction.member,
			await client.bulbutils.translate("global_mod_action_log", message.guild?.id, {
				action: await client.bulbutils.translate("mod_action_types.warn", message.guild?.id, {}),
				moderator: interaction.user,
				target: message.author,
				reason: i.values[0],
			}),
			i.values[0],
		);

		await i.update({
			content: await client.bulbutils.translate("action_success", interaction.guild?.id, {
				action: await client.bulbutils.translate("mod_action_types.warn", interaction.guild?.id, {}),
				target: message.author,
				moderator: interaction.user,
				reason: i.values[0],
				infraction_id: infID,
			}),
			components: [],
		});
	});
}
