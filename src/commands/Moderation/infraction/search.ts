import { CommandInteraction, MessageActionRow, MessageSelectMenu, Snowflake, User } from "discord.js";
import InfractionsManager from "../../../utils/managers/InfractionsManager";
import BulbBotClient from "../../../structures/BulbBotClient";
import ApplicationSubCommand from "../../../structures/ApplicationSubCommand";
import { ApplicationCommandOptionType } from "discord-api-types/v10";
import ApplicationCommand from "../../../structures/ApplicationCommand";

const infractionManager: InfractionsManager = new InfractionsManager();

export default class extends ApplicationSubCommand {
	constructor(client: BulbBotClient, parent: ApplicationCommand) {
		super(client, parent, {
			name: "search",
			description: "Search for infractions by user",
			options: [
				{
					name: "user",
					type: ApplicationCommandOptionType.User,
					description: "The user to search for",
					required: true,
				},
				{
					name: "page",
					type: ApplicationCommandOptionType.Number,
					description: "The page of results to show",
					required: false,
					min_value: 1,
				},
			],
		});
	}

	public async run(interaction: CommandInteraction): Promise<void> {
		const user: User = interaction.options.getUser("user") as User;
		const page: number = interaction.options.getNumber("page") || 1;

		const options: any[] = [];
		const infs =
			(await infractionManager.getAllUserInfractions({
				guildId: interaction.guild?.id as Snowflake,
				targetId: user.id,
				page,
			})) || [];

		if (!infs.length) {
			return interaction.reply({
				content: await this.client.bulbutils.translate("infraction_search_not_found", interaction.guild?.id, {
					target: user,
				}),
				ephemeral: true,
			});
		}

		for (let i = 0; i < 25; i++) {
			// Included this as it's part of our original code. Not sure if it's needed though.
			if (infs[i] === undefined) continue;

			options.push({
				label: `${infs[i].action} (#${infs[i].id})`,
				description: await this.client.bulbutils.translate("infraction_interaction_description", interaction.guild?.id, {}),
				value: `inf_${infs[i].id}`,
				emoji: this.client.bulbutils.formatAction(infs[i].action),
			});
		}

		const row = new MessageActionRow().addComponents(
			new MessageSelectMenu()
				.setPlaceholder(await this.client.bulbutils.translate("infraction_interaction_placeholder", interaction.guild?.id, {}))
				.setCustomId("infraction")
				.addOptions(options),
		);

		return interaction.reply({
			content: await this.client.bulbutils.translate("infraction_interaction_reply", interaction.guild?.id, {
				target: user,
			}),
			components: [row],
		});
	}
}
