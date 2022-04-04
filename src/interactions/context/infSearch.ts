import { ContextMenuInteraction, Message, MessageActionRow, MessageSelectMenu, Snowflake, User } from "discord.js";
import BulbBotClient from "../../structures/BulbBotClient";
import InfractionsManager from "../../utils/managers/InfractionsManager";
import { Infraction } from "../../utils/types/DatabaseStructures";

const infractionManager: InfractionsManager = new InfractionsManager();

export default async function (client: BulbBotClient, interaction: ContextMenuInteraction, message: Message): Promise<void> {
	const user: User = message.author;

	const options: any[] = [];
	const infs: Infraction[] = <Infraction[]>await infractionManager.getAllUserInfractions(<Snowflake>interaction.guild?.id, user.id, 0);

	if (!infs.length) return interaction.reply({ content: await client.bulbutils.translate("infraction_search_not_found", interaction.guild?.id, { target: user }), ephemeral: true });

	for (let i = 0; i < 25; i++) {
		if (infs?.[i] === undefined) continue;

		options.push({
			label: `${infs[i].action} (#${infs[i].id})`,
			description: await client.bulbutils.translate("infraction_interaction_description", interaction.guild?.id, {}),
			value: `inf_${infs[i].id}`,
			emoji: client.bulbutils.formatAction(infs[i].action),
		});
	}

	const row = new MessageActionRow().addComponents(
		new MessageSelectMenu()
			.setPlaceholder(await client.bulbutils.translate("infraction_interaction_placeholder", interaction.guild?.id, {}))
			.setCustomId("infraction")
			.addOptions(options),
	);

	await interaction.reply({
		content: await client.bulbutils.translate("infraction_interaction_reply", interaction.guild?.id, {
			target: user,
		}),
		components: [row],
		ephemeral: true,
	});
}
