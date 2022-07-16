import ApplicationCommand from "../../structures/ApplicationCommand";
import BulbBotClient from "../../structures/BulbBotClient";
import { ApplicationCommandType } from "discord-api-types/v10";
import { ContextMenuInteraction, MessageActionRow, MessageSelectMenu, User } from "discord.js";
import InfractionsManager from "../../utils/managers/InfractionsManager";

const infractionManager: InfractionsManager = new InfractionsManager();

export default class ContextInfSearch extends ApplicationCommand {
	constructor(client: BulbBotClient) {
		super(client, {
			name: "List all Infractions",
			type: ApplicationCommandType.User,
			description: "",
			options: null,
			command_permissions: ["MODERATE_MEMBERS"],
		});
	}

	public async run(interaction: ContextMenuInteraction): Promise<void> {
		const user: User = (await this.client.bulbfetch.getUser(interaction.targetId)) as User;

		if (!interaction.guild) return;
		const options: any[] = [];
		const infs = await infractionManager.getAllUserInfractions({ guildId: interaction.guild.id, targetId: user.id, pageSize: 0 });

		if (!infs?.length) return interaction.reply({ content: await this.client.bulbutils.translate("infraction_search_not_found", interaction.guild.id, { target: user }), ephemeral: true });

		for (let i = 0; i < 25; i++) {
			if (infs[i] === undefined) continue;

			options.push({
				label: `${infs[i].action} (#${infs[i].id})`,
				description: await this.client.bulbutils.translate("infraction_interaction_description", interaction.guild.id, {}),
				value: `inf_${infs[i].id}`,
				emoji: this.client.bulbutils.formatAction(infs[i].action),
			});
		}

		const row = new MessageActionRow().addComponents(
			new MessageSelectMenu()
				.setPlaceholder(await this.client.bulbutils.translate("infraction_interaction_placeholder", interaction.guild.id, {}))
				.setCustomId("infraction")
				.addOptions(options),
		);

		await interaction.reply({
			content: await this.client.bulbutils.translate("infraction_interaction_reply", interaction.guild.id, {
				target: user,
			}),
			components: [row],
			ephemeral: true,
		});
	}
}
