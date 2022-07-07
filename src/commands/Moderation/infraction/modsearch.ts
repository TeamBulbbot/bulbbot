import BulbBotClient from "../../../structures/BulbBotClient";
import { CommandInteraction, MessageActionRow, MessageSelectMenu, Snowflake, User } from "discord.js";
import InfractionsManager from "../../../utils/managers/InfractionsManager";
import ApplicationSubCommand from "../../../structures/ApplicationSubCommand";
import ApplicationCommand from "../../../structures/ApplicationCommand";
import { ApplicationCommandOptionType } from "discord-api-types/v10";

const infractionsManager: InfractionsManager = new InfractionsManager();

export default class extends ApplicationSubCommand {
	constructor(client: BulbBotClient, parent: ApplicationCommand) {
		super(client, parent, {
			name: "modsearch",
			description: "Search for infractions by moderator",
			options: [
				{
					name: "moderator",
					type: ApplicationCommandOptionType.User,
					description: "The moderator to search for",
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
		const moderator: User = interaction.options.getUser("moderator") as User;
		const page: number = interaction.options.getNumber("page") || 1;

		const options: any[] = [];
		const infs = (await infractionsManager.getModeratorInfractions({ guildId: interaction.guild?.id as Snowflake, targetId: moderator.id, page })) || [];

		if (!infs.length) {
			return interaction.reply({
				content: await this.client.bulbutils.translate("infraction_search_not_found", interaction.guild?.id, {
					target: moderator,
				}),
				ephemeral: true,
			});
		}

		for (let i = 0; i < 25; i++) {
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
				target: moderator,
			}),
			components: [row],
		});
	}
}
