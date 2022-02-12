import Command from "../../structures/Command";
import CommandContext from "../../structures/CommandContext";
import { Guild, GuildBan, GuildMember, Message, MessageActionRow, MessageSelectMenu, MessageSelectOptionData, Permissions, SelectMenuInteraction, Snowflake, User } from "discord.js";
import BulbBotClient from "../../structures/BulbBotClient";
import BanpoolManager from "../../utils/managers/BanpoolManager";
import { NonDigits } from "../../utils/Regex";
import InfractionsManager from "../../utils/managers/InfractionsManager";
import LoggingManager from "../../utils/managers/LoggingManager";
import * as Emotes from "../../emotes.json";

const { createInfraction }: InfractionsManager = new InfractionsManager();
const { sendEventLog }: LoggingManager = new LoggingManager();
const { getPools, getGuildsFromPools, hasBanpoolLog, getPoolData }: BanpoolManager = new BanpoolManager();

export default class extends Command {
	constructor(client: BulbBotClient, name: string) {
		super(client, {
			name,
			description: "Crossban a user across multiple servers",
			category: "Moderation",
			aliases: ["poolban"],
			usage: "<user> <reason>",
			examples: ["crossban 123456789012345678 rude user", "crossban 123456789012345678 rude user", "crossban @Wumpus#0000 rude user"],
			argList: ["user:User", "reason:String"],
			minArgs: 2,
			maxArgs: -1,
			clearance: 75,
			clientPerms: ["BAN_MEMBERS"],
			premium: true,
		});
	}

	async run(context: CommandContext, args: string[]): Promise<void | Message> {
		const targetID: Snowflake = args[0].replace(NonDigits, "");
		let reason: string = args.slice(1).join(" ");
		let target: User | undefined = await this.client.bulbfetch.getUser(targetID);

		if (!(await hasBanpoolLog(context.guild!?.id))) return context.channel.send(await this.client.bulbutils.translate("banpool_missing_logging", context.guild?.id, {}));

		if (!target)
			return await context.channel.send(
				await this.client.bulbutils.translate("global_not_found", context.guild?.id, {
					type: await this.client.bulbutils.translate("global_not_found_types.user", context.guild?.id, {}),
					arg_expected: "user:User",
					arg_provided: args[0],
					usage: this.usage,
				}),
			);

		const pools: { id: number; name: string; createdAt: Date; updatedAt: Date; guildId: number }[] = await getPools(context.guild!?.id);
		const options: Promise<MessageSelectOptionData>[] = pools.map(async pool => {
			const data = await getPoolData(pool.name);

			return {
				label: pool.name,
				value: `${pool.id}:${pool.name}`,
				description: await this.client.bulbutils.translate("crossban_select_subscribed", context.guild?.id, { amount: data.length }),
			};
		});

		const row = new MessageActionRow().addComponents(
			new MessageSelectMenu()
				.setCustomId("banpool-dropdown")
				.setPlaceholder("Select banpool(s)")
				.addOptions(await Promise.all(options))
				.setMinValues(1),
		);
		const banpoolSelect: Message = await context.channel.send({ components: [row], content: await this.client.bulbutils.translate("crossban_select_pools", context.guild?.id, {}) });
		const compCollector = banpoolSelect.createMessageComponentCollector({ componentType: "SELECT_MENU", time: 60_000 });

		compCollector.on("collect", async (interaction: SelectMenuInteraction) => {
			if (interaction.user.id !== context.author.id) return interaction.reply({ content: await this.client.bulbutils.translate("global_not_invoked_by_user", context.guild?.id, {}), ephemeral: true });

			const poolGuilds: any[] = await getGuildsFromPools(
				interaction.values.map(value => {
					return value.split(":")[0];
				}),
			);
			let totalBans: number = 0;

			for (let i = 0; i < poolGuilds.length; i++) {
				const guildId = poolGuilds[i];
				const guild: Guild = await this.client.guilds.fetch(guildId);
				if (!reason) reason = await this.client.bulbutils.translate("global_no_reason", guild?.id, {});

				if (!guild.me?.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) continue;

				const banList = await guild.bans.fetch();
				const bannedUser = banList.find((ban: GuildBan) => ban.user.id === target!.id);

				if (bannedUser) continue;
				else {
					let guildTarget: GuildMember | undefined = undefined;
					try {
						guildTarget = await this.client.bulbfetch.getGuildMember(guild?.members, target!.id);
					} catch (_) {}

					if (!guildTarget) {
						totalBans++;
						banUser(this.client, target!, context.author, guild, context.guild!, reason);
					} else {
						if (guildTarget.bannable) {
							totalBans++;
							banUser(this.client, target!, context.author, guild, context.guild!, reason);
						} else continue;
					}
				}
			}

			banpoolSelect.edit({
				content: await this.client.bulbutils.translate("crossban_success", context.guild?.id, {
					target,
					totalBans,
					totalPossible: poolGuilds.length,
					usedPools: interaction.values
						.map(value => {
							return `\`${value.split(":")[1]}\``;
						})
						.join(" "),
				}),
				components: [],
			});
		});
	}
}

async function banUser(client: BulbBotClient, target: User, moderator: User, guild: Guild, startedGuild: Guild, reason: string) {
	const infraction: any = await createInfraction(guild.id, "poolban", true, reason, target, moderator);
	await sendEventLog(
		client,
		guild,
		"banpool",
		await client.bulbutils.translate("crossban_reason", guild?.id, {
			emoji: Emotes.actions.BAN,
			target,
			startedGuild,
			moderator,
			reason,
			infraction_id: infraction.id,
		}),
	);

	guild.members.ban(target, {
		reason: await client.bulbutils.translate("crossban_reason_audit", guild?.id, {
			startedGuild,
			moderator,
			reason,
		}),
	});
}
