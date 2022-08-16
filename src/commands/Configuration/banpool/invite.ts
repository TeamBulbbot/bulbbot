import { CommandInteraction, Snowflake } from "discord.js";
import BulbBotClient from "../../../structures/BulbBotClient";
import BanpoolManager from "../../../utils/managers/BanpoolManager";
import LoggingManager from "../../../utils/managers/LoggingManager";
import ApplicationSubCommand from "../../../structures/ApplicationSubCommand";
import ApplicationCommand from "../../../structures/ApplicationCommand";
import { ApplicationCommandOptionType } from "discord-api-types/v10";

const { sendEventLog }: LoggingManager = new LoggingManager();
const { haveAccessToPool, hasBanpoolLog }: BanpoolManager = new BanpoolManager();

export default class BanpoolInvite extends ApplicationSubCommand {
	constructor(client: BulbBotClient, parent: ApplicationCommand) {
		super(client, parent, {
			name: "invite",
			description: "Generates an invite code for the specified banpool.",
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
		if (!(await haveAccessToPool(interaction.guild?.id as Snowflake, name)))
			return interaction.reply({
				content: await this.client.bulbutils.translate("banpool_missing_access_not_found", interaction.guild?.id, {
					pool: name,
				}),
				ephemeral: true,
			});

		const code: string = this.generateInviteCode();

		this.client.banpoolInvites.set(code, {
			guild: {
				id: interaction.guild?.id,
				name: interaction.guild?.name,
			},
			inviter: {
				tag: interaction.user.tag,
				id: interaction.user.id,
			},
			banpool: {
				name,
				code,
				expires: Math.floor(Date.now() / 1000) + 15 * 60,
			},
		});

		await sendEventLog(
			this.client,
			interaction.guild,
			"banpool",
			await this.client.bulbutils.translate("banpool_invite_success_log", interaction.guild?.id, {
				user: interaction.user,
				name,
				expireTime: Math.floor(Date.now() / 1000 + 15 * 60),
			}),
		);

		setTimeout(() => {
			this.client.banpoolInvites.delete(code);
		}, 15 * 60 * 1000);

		return interaction.reply({
			ephemeral: true,
			content: await this.client.bulbutils.translate("banpool_invite_reply", interaction.guild?.id, {
				code,
				name,
				expireTime: Math.floor(Date.now() / 1000 + 15 * 60),
			}),
		});
	}

	private generateInviteCode(): string {
		const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
		let res = "";

		for (let _ = 0; _ < 10; _++) res += chars[Math.floor(Math.random() * chars.length)];

		return res;
	}
}
