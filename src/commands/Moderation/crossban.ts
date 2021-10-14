import Command from "../../structures/Command";
import CommandContext from "../../structures/CommandContext";
import { Guild, GuildBan, GuildMember, Message, Permissions, Snowflake, User } from "discord.js";
import BulbBotClient from "../../structures/BulbBotClient";
import BanpoolManager from "../../utils/managers/BanpoolManager";
import { NonDigits } from "../../utils/Regex";
import InfractionsManager from "../../utils/managers/InfractionsManager";
import LoggingManager from "../../utils/managers/LoggingManager";
import * as Emotes from "../../emotes.json";

const { createInfraction }: InfractionsManager = new InfractionsManager();
const { sendEventLog }: LoggingManager = new LoggingManager();
const { getPools, getGuildsFromPools }: BanpoolManager = new BanpoolManager();

export default class extends Command {
	constructor(client: BulbBotClient, name: string) {
		super(client, {
			name,
			description: "Too be written",
			category: "Moderation",
			aliases: ["poolban"],
			usage: "<user> <reason>",
			examples: ["crossban 123456789012345678 rude user", "crossban 123456789012345678 rude user", "crossban 123456789012345678 rude user"],
			argList: ["user:User", "reason:string"],
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
		let target: User;

		try {
			target = await this.client.users.fetch(targetID);
		} catch (error) {
			await context.channel.send(
				await this.client.bulbutils.translate("global_not_found", context.guild?.id, {
					type: await this.client.bulbutils.translate("global_not_found_types.user", context.guild?.id, {}),
					arg_expected: "user:User",
					arg_provided: args[0],
					usage: this.usage,
				}),
			);
			return;
		}

		const pooles: any[] = await getPools(context.guild!?.id);
		const poolGuilds: any[] = await getGuildsFromPools(pooles);
		let totalBans: number = 0;

		for (let i = 0; i < poolGuilds.length; i++) {
			const guildId = poolGuilds[i];
			const guild: Guild = await this.client.guilds.fetch(guildId);
			if (!reason) reason = await this.client.bulbutils.translate("global_no_reason", guild?.id, {});

			if (!guild.me?.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) {
				console.log("missing perms to ban");
				continue;
			}

			// check if user is already banned
			const banList = await guild.bans.fetch();
			const bannedUser = banList.find((ban: GuildBan) => ban.user.id === target.id);

			// todo remove console logs
			if (bannedUser) {
				console.log("already banned");
				continue;
			} else {
				let guildTarget: GuildMember | undefined = undefined;
				try {
					guildTarget = await guild.members.fetch(target.id);
				} catch (_) {}

				if (!guildTarget) {
					totalBans++;
					banUser(this.client, target, context.author, guild, context.guild!, reason);
					//console.log("not in guild ban");
				} else {
					if (guildTarget.bannable) {
						totalBans++;
						banUser(this.client, target, context.author, guild, context.guild!, reason);
						//console.log("in guild ban");
					} else {
						console.log("user is in guild but I cant ban");
						continue;
					}
				}
			}
		}

		// todo write a better message lol
		context.channel.send(`total bans: ${totalBans}/${poolGuilds.length}`);
	}
}

async function banUser(client: BulbBotClient, target: User, moderator: User, guild: Guild, startedGuild: Guild, reason: string) {
	const infraction: any = await createInfraction(guild.id, "poolban", true, reason, target, moderator);
	await sendEventLog(
		client,
		guild,
		"banpool", // todo move to translator
		`${Emotes.actions.BAN} **${target.tag}** \`${target.id}\` has been crossbanned from **${startedGuild.name}** \`(${startedGuild.id})\` by **${moderator.tag}** \`(${moderator.id})\` for **${reason}** \`[#${infraction.id}]\``,
	);
	// todo remove this line before prod
	//guild.members.ban(target, { reason: `Crossban from: ${startedGuild.name} (${startedGuild.id}) | Moderator: ${moderator.tag} (${moderator.id}) for ${reason}` });
	console.log(`[POOL BAN] ${target.tag} was beaned in ${guild.name} for ${reason}`);
}
