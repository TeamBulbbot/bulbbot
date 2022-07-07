import BulbBotClient from "../../../structures/BulbBotClient";
import { CommandInteraction, Snowflake } from "discord.js";
import InfractionsManager from "../../../utils/managers/InfractionsManager";
import ApplicationSubCommand from "../../../structures/ApplicationSubCommand";
import ApplicationCommand from "../../../structures/ApplicationCommand";
import { ApplicationCommandOptionType } from "discord-api-types/v10";

const infractionsManager: InfractionsManager = new InfractionsManager();

export default class extends ApplicationSubCommand {
	constructor(client: BulbBotClient, parent: ApplicationCommand) {
		super(client, parent, {
			name: "claim",
			description: "Claim responsibility over an infraction",
			options: [
				{
					name: "id",
					type: ApplicationCommandOptionType.Integer,
					description: "The ID of the infraction",
					required: true,
					min_value: 1,
					max_value: 2147483647,
				},
			],
		});
	}

	public async run(interaction: CommandInteraction): Promise<void> {
		const infractionId: number = interaction.options.getInteger("id") as number;
		const infraction = await infractionsManager.getInfraction(interaction.guild?.id as Snowflake, infractionId);

		if (infraction === null) {
			return interaction.reply({
				content: await this.client.bulbutils.translate("infraction_not_found", interaction.guild?.id, {
					infraction_id: infractionId,
				}),
				ephemeral: true,
			});
		}

		if (infraction.moderatorId === interaction.user.id) {
			return interaction.reply({
				content: await this.client.bulbutils.translate("infraction_claim_fail", interaction.guild?.id, { infraction_id: infractionId }),
				ephemeral: true,
			});
		}

		await infractionsManager.updateModerator(interaction.guild?.id as Snowflake, infractionId, interaction.user);

		return interaction.reply(await this.client.bulbutils.translate("infraction_claim_success", interaction.guild?.id, { infraction_id: infractionId }));
	}
}
