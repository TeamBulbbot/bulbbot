import { CommandInteraction, Snowflake } from "discord.js";
import BulbBotClient from "../../../structures/BulbBotClient";
import BanpoolManager from "../../../utils/managers/BanpoolManager";
import LoggingManager from "../../../utils/managers/LoggingManager";
import ApplicationCommand from "../../../structures/ApplicationCommand";
import { ApplicationCommandOptionType } from "discord-api-types/v10";
import ApplicationSubCommand from "../../../structures/ApplicationSubCommand";

const { doesBanpoolExist, createBanpool, joinBanpool, hasBanpoolLog }: BanpoolManager = new BanpoolManager();
const { sendEventLog }: LoggingManager = new LoggingManager();

export default class BanpoolCreate extends ApplicationSubCommand {
	constructor(client: BulbBotClient, parent: ApplicationCommand) {
		super(client, parent, {
			name: "create",
			description: "Create a banpool",
			options: [
				{
					name: "name",
					type: ApplicationCommandOptionType.String,
					description: "The name of the banpool",
					required: true,
					max_length: 255,
				},
			],
		});
	}

	public async run(interaction: CommandInteraction): Promise<void> {
		const name = interaction.options.getString("name") as string;

		if (!(await hasBanpoolLog(interaction.guild?.id as Snowflake)))
			return interaction.reply({
				content: await this.client.bulbutils.translate("banpool_missing_logging", interaction.guild?.id, {}),
				ephemeral: true,
			});
		if (await doesBanpoolExist(name))
			return interaction.reply({
				content: await this.client.bulbutils.translate("banpool_create_name_exists", interaction.guild?.id, {}),
				ephemeral: true,
			});

		await createBanpool(interaction.guild?.id as Snowflake, name);
		await joinBanpool(
			{
				banpool: {
					name,
				},
			},
			interaction.guild?.id as Snowflake,
		);

		await sendEventLog(
			this.client,
			interaction.guild,
			"banpool",
			await this.client.bulbutils.translate("banpool_create_log", interaction.guild?.id, {
				user: interaction.user,
				name,
			}),
		);

		return interaction.reply(
			await this.client.bulbutils.translate("banpool_create_success", interaction.guild?.id, {
				name,
			}),
		);
	}
}
