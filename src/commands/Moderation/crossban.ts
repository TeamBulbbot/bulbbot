import { CommandInteraction, Guild, GuildBan, GuildMember, MessageActionRow, MessageSelectMenu, MessageSelectOptionData, Permissions, SelectMenuInteraction, Snowflake, User } from "discord.js";
import BulbBotClient from "../../structures/BulbBotClient";
import BanpoolManager from "../../utils/managers/BanpoolManager";
import InfractionsManager from "../../utils/managers/InfractionsManager";
import LoggingManager from "../../utils/managers/LoggingManager";
import * as Emotes from "../../emotes.json";
import { tryIgnore } from "../../utils/helpers";
import ApplicationCommand from "../../structures/ApplicationCommand";
import { ApplicationCommandOptionType, ApplicationCommandType } from "discord-api-types/v10";

const infractionsManager: InfractionsManager = new InfractionsManager();
const banpoolManager: BanpoolManager = new BanpoolManager();
const loggingManager: LoggingManager = new LoggingManager();

export default class extends ApplicationCommand {
	constructor(client: BulbBotClient, name: string) {
		super(client, {
			name,
			description: "Crossban a user across multiple servers",
			type: ApplicationCommandType.ChatInput,
			options: [
				{
					name: "user",
					type: ApplicationCommandOptionType.User,
					description: "The user that should be cross-banned",
					required: true,
				},
				{
					name: "reason",
					type: ApplicationCommandOptionType.String,
					description: "The reason behind the cross-ban",
					required: true,
				},
			],
			premium: true,
			command_permissions: ["BAN_MEMBERS", "ADMINISTRATOR"],
			client_permissions: ["BAN_MEMBERS"],
		});
	}

	public async run(interaction: CommandInteraction) {
		const user = interaction.options.getUser("user") as User;
		let reason = interaction.options.getString("reason") as string;

		const pools = await banpoolManager.getPools(interaction.guild?.id as Snowflake);
		const options: Promise<MessageSelectOptionData>[] = pools.map(async (pool) => {
			const data = (await banpoolManager.getPoolData(pool.name)) || { banpoolSubscribers: [] };

			return {
				label: pool.name,
				value: `${pool.id}:${pool.name}`,
				description: await this.client.bulbutils.translate("crossban_select_subscribed", interaction.guild?.id, { amount: data.banpoolSubscribers.length }),
			};
		});

		const row = new MessageActionRow().addComponents(
			new MessageSelectMenu()
				.setCustomId("banpool-dropdown")
				.setPlaceholder("Select banpool(s)")
				.addOptions(await Promise.all(options))
				.setMinValues(1),
		);

		await interaction.reply({
			content: await this.client.bulbutils.translate("crossban_select_pools", interaction.guild?.id, {}),
			components: [row],
			ephemeral: true,
		});
		const collector = interaction.channel?.createMessageComponentCollector({ time: 60_000 });

		collector?.on("collect", async (i: SelectMenuInteraction) => {
			const poolGuilds = await banpoolManager.getGuildIdsFromPools(
				i.values.map((value) => {
					return parseInt(value.split(":")[0], 10);
				}),
			);

			let totalBans = 0;

			for (let i = 0; i < poolGuilds.length; i++) {
				const guildId = poolGuilds[i];
				const guild: Guild = await this.client.guilds.fetch(guildId);
				if (!reason) reason = await this.client.bulbutils.translate("global_no_reason", guild.id, {});

				if (!guild.me?.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) continue;

				const banList = await guild.bans.fetch();
				const bannedUser = banList.find((ban: GuildBan) => ban.user.id === user.id);

				if (!bannedUser) {
					const guildTarget: GuildMember | undefined = await tryIgnore(() => this.client.bulbfetch.getGuildMember(guild.members, user.id));

					if (!guildTarget) {
						totalBans++;
						await this.crossban(this.client, user, interaction.user, guild, interaction.guild as Guild, reason);
					} else {
						if (guildTarget.bannable) {
							totalBans++;
							await this.crossban(this.client, user, interaction.user, guild, interaction.guild as Guild, reason);
						}
					}
				}
			}

			await interaction.followUp({
				content: await this.client.bulbutils.translate("crossban_success", interaction.guild?.id, {
					target: user,
					totalBans,
					totalPossible: poolGuilds.length,
					usedPools: i.values
						.map((value) => {
							return `\`${value.split(":")[1]}\``;
						})
						.join(" "),
				}),
				components: [],
			});

			await interaction.editReply({
				content: await this.client.bulbutils.translate("ban_message_dismiss", interaction.guild?.id, {}),
				components: [],
			});
		});
	}

	private async crossban(client: BulbBotClient, target: User, moderator: User, guild: Guild, originalGuild: Guild, reason: string) {
		const infraction = await infractionsManager.createInfraction(guild.id, "poolban", true, reason, target, moderator);
		await loggingManager.sendEventLog(
			client,
			guild,
			"banpool",
			await client.bulbutils.translate("crossban_reason", guild.id, {
				emoji: Emotes.actions.BAN,
				target,
				originalGuild,
				moderator,
				reason,
				infraction_id: infraction.id,
			}),
		);

		await guild.members.ban(target, {
			reason: await client.bulbutils.translate("crossban_reason_audit", guild.id, {
				originalGuild,
				moderator,
				reason,
			}),
		});
	}
}
