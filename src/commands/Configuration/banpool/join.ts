import { CommandInteraction, Guild, Snowflake } from "discord.js";
import BulbBotClient from "../../../structures/BulbBotClient";
import BanpoolManager from "../../../utils/managers/BanpoolManager";
import LoggingManager from "../../../utils/managers/LoggingManager";
import ApplicationSubCommand from "../../../structures/ApplicationSubCommand";
import ApplicationCommand from "../../../structures/ApplicationCommand";
import { ApplicationCommandOptionType } from "discord-api-types/v10";

const { sendEventLog }: LoggingManager = new LoggingManager();
const { joinBanpool, hasBanpoolLog }: BanpoolManager = new BanpoolManager();

export default class extends ApplicationSubCommand {
	constructor(client: BulbBotClient, parent: ApplicationCommand) {
		super(client, parent, {
			name: "join",
			description: "Join a banpool using a generated invite code",
			options: [
				{
					name: "code",
					description: "The invite code to join the banpool.",
					type: ApplicationCommandOptionType.String,
					required: true,
					min_length: 10,
					max_length: 10,
				},
			],
		});
	}

	public async run(interaction: CommandInteraction): Promise<void> {
		const code: string = interaction.options.getString("code") as string;
		const invite = this.client.banpoolInvites.get(code) as { guild: any; banpool: any; inviter: any } & Record<string, any>;

		if (!(await hasBanpoolLog(interaction.guild?.id as Snowflake)))
			return interaction.reply({
				content: await this.client.bulbutils.translate("banpool_missing_logging", interaction.guild?.id, {}),
				ephemeral: true,
			});
		if (!invite)
			return interaction.reply({
				content: await this.client.bulbutils.translate("banpool_join_unable_to_find", interaction.guild?.id, {}),
				ephemeral: true,
			});
		if (invite.guild.id === interaction.guild?.id)
			return interaction.reply({
				content: await this.client.bulbutils.translate("banpool_join_own_guild", interaction.guild?.id, {}),
				ephemeral: true,
			});
		if (!(await joinBanpool(invite, interaction.guild?.id as Snowflake)))
			return interaction.reply({
				content: await this.client.bulbutils.translate("banpool_join_error", interaction.guild?.id, {}),
				ephemeral: true,
			});

		const poolguild: Guild = await this.client.guilds.fetch(invite.guild.id);

		await sendEventLog(
			this.client,
			poolguild,
			"banpool",
			await this.client.bulbutils.translate("banpool_join_log_og", interaction.guild?.id, {
				user: interaction.user,
				invite,
				guild: interaction.guild as Guild,
			}),
		);
		await sendEventLog(
			this.client,
			interaction.guild,
			"banpool",
			await this.client.bulbutils.translate("banpool_join_log", interaction.guild?.id, {
				user: interaction.user,
				invite,
			}),
		);

		this.client.banpoolInvites.delete(invite.banpool.code);

		return interaction.reply(await this.client.bulbutils.translate("banpool_join_success", interaction.guild?.id, {}));
	}
}
