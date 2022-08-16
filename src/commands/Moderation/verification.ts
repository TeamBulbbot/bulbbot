import { CommandInteraction, VerificationLevel } from "discord.js";
import BulbBotClient from "../../structures/BulbBotClient";
import ApplicationCommand from "../../structures/ApplicationCommand";
import { ApplicationCommandOptionType, ApplicationCommandType } from "discord-api-types/v10";

export default class Verification extends ApplicationCommand {
	constructor(client: BulbBotClient, name: string) {
		super(client, {
			name,
			description: "Set the verification level of the server",
			type: ApplicationCommandType.ChatInput,
			options: [
				{
					name: "level",
					description: "The verification level to set the server to",
					type: ApplicationCommandOptionType.String,
					required: true,
					choices: [
						{ name: "None", value: "NONE" },
						{ name: "Low", value: "LOW" },
						{ name: "Medium", value: "MEDIUM" },
						{ name: "High", value: "HIGH" },
						{ name: "Very High", value: "VERY_HIGH" },
					],
				},
			],
			command_permissions: ["MANAGE_GUILD"],
			client_permissions: ["MANAGE_GUILD"],
		});
	}

	public async run(interaction: CommandInteraction): Promise<void> {
		const level = interaction.options.getString("level") as VerificationLevel;

		if (interaction.guild?.features.includes("COMMUNITY") && level === "NONE")
			return interaction.reply({
				content: await this.client.bulbutils.translate("verifcation_level_community_none", interaction.guild?.id, {}),
				ephemeral: true,
			});

		await interaction.guild?.setVerificationLevel(level);

		return interaction.reply(await this.client.bulbutils.translate("verification_level_success", interaction.guild?.id, { level }));
	}
}
