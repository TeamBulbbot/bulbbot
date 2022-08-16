import { CommandInteraction, Snowflake } from "discord.js";
import InfractionsManager from "../../../utils/managers/InfractionsManager";
import BulbBotClient from "../../../structures/BulbBotClient";
import ApplicationSubCommand from "../../../structures/ApplicationSubCommand";
import ApplicationCommand from "../../../structures/ApplicationCommand";
import { ApplicationCommandOptionType } from "discord-api-types/v10";

const infractionsManager: InfractionsManager = new InfractionsManager();

export default class InfractionUpdate extends ApplicationSubCommand {
	constructor(client: BulbBotClient, parent: ApplicationCommand) {
		super(client, parent, {
			name: "update",
			description: "Update the reason of an infraction.",
			options: [
				{
					name: "id",
					type: ApplicationCommandOptionType.Integer,
					description: "The ID of the infraction",
					required: true,
					min_value: 1,
					max_value: 2147483647,
				},
				{
					name: "reason",
					type: ApplicationCommandOptionType.String,
					description: "The new reason for the infraction",
					required: true,
				},
			],
		});
	}

	public async run(interaction: CommandInteraction): Promise<void> {
		const infractionId: number = interaction.options.getInteger("id") as number;
		const reason: string = interaction.options.getString("reason") as string;

		const inf = await infractionsManager.getInfraction(interaction.guild?.id as Snowflake, infractionId);
		if (!inf) {
			return interaction.reply({
				content: await this.client.bulbutils.translate("infraction_not_found", interaction.guild?.id, {
					infraction_id: infractionId,
				}),
				ephemeral: true,
			});
		}

		if (inf.moderatorId !== interaction.user.id) {
			return interaction.reply({
				content: await this.client.bulbutils.translate("infraction_claim_not_owned", interaction.guild?.id, {
					infraction_id: infractionId,
				}),
				ephemeral: true,
			});
		}

		if (!(await infractionsManager.getInfraction(interaction.guild?.id as Snowflake, infractionId))) {
			return interaction.reply({
				content: await this.client.bulbutils.translate("infraction_not_found", interaction.guild?.id, {
					infraction_id: infractionId,
				}),
				ephemeral: true,
			});
		}

		await infractionsManager.updateReason(interaction.guild?.id as Snowflake, infractionId, reason);
		return interaction.reply({
			content: await this.client.bulbutils.translate("infraction_update_success", interaction.guild?.id, {
				infraction_id: infractionId,
			}),
		});
	}
}
