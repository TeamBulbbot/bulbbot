import { CommandInteraction, Guild, Snowflake } from "discord.js";
import BulbBotClient from "../../../structures/BulbBotClient";
import LoggingManager from "../../../utils/managers/LoggingManager";
import BanpoolManager from "../../../utils/managers/BanpoolManager";
import ApplicationSubCommand from "../../../structures/ApplicationSubCommand";
import ApplicationCommand from "../../../structures/ApplicationCommand";
import { ApplicationCommandOptionType } from "discord-api-types/v10";

const { sendEventLog }: LoggingManager = new LoggingManager();
const { isGuildInPool, haveAccessToPool, leavePool, getCreatorGuild, hasBanpoolLog }: BanpoolManager = new BanpoolManager();

export default class BanpoolLeave extends ApplicationSubCommand {
	constructor(client: BulbBotClient, parent: ApplicationCommand) {
		super(client, parent, {
			name: "leave",
			description: "Leave a banpool.",
			options: [
				{
					name: "name",
					description: "The name of the banpool.",
					type: ApplicationCommandOptionType.String,
					required: true,
					max_length: 255,
				},
			],
		});
	}

	public async run(interaction: CommandInteraction): Promise<void> {
		const name: string = interaction.options.getString("name") as string;

		if (!(await hasBanpoolLog(interaction.guild?.id as Snowflake)))
			return interaction.reply({
				content: await this.client.bulbutils.translate("banpool_missing_logging", interaction.guild?.id, {}),
				ephemeral: true,
			});
		if (await haveAccessToPool(interaction.guild?.id as Snowflake, name))
			return interaction.reply({
				content: await this.client.bulbutils.translate("banpool_leave_own", interaction.guild?.id, {}),
				ephemeral: true,
			});
		if (!(await isGuildInPool(interaction.guild?.id as Snowflake, name)))
			return interaction.reply({
				content: await this.client.bulbutils.translate("banpool_leave_not_found", interaction.guild?.id, {}),
				ephemeral: true,
			});

		await leavePool(interaction.guild?.id as Snowflake, name);

		await sendEventLog(
			this.client,
			await this.client.guilds.fetch(await getCreatorGuild(name)),
			"banpool",
			await this.client.bulbutils.translate("banpool_leave_log_og", interaction.guild?.id, {
				user: interaction.user,
				name,
				guild: interaction.guild as Guild,
			}),
		);
		await sendEventLog(
			this.client,
			interaction.guild,
			"banpool",
			await this.client.bulbutils.translate("banpool_leave_log", interaction.guild?.id, {
				user: interaction.user,
				name,
			}),
		);

		return interaction.reply(await this.client.bulbutils.translate("banpool_leave_success", interaction.guild?.id, {}));
	}
}
