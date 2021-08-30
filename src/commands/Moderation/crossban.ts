import Command from "../../structures/Command";
import CommandContext from "../../structures/CommandContext";
import { Guild, GuildMember, Message, Snowflake, User } from "discord.js";
import BulbBotClient from "../../structures/BulbBotClient";
import LoggingManager from "../../utils/managers/LoggingManager";
import BanpoolManager from "../../utils/managers/BanpoolManager";
import InfractionsManager from "../../utils/managers/InfractionsManager";
import { NonDigits } from "../../utils/Regex";
import { BanType } from "../../utils/types/BanType";

const { getPools, getGuildsFromPools }: BanpoolManager = new BanpoolManager();
const infractionsManager: InfractionsManager = new InfractionsManager();
const loggingManager: LoggingManager = new LoggingManager();

export default class extends Command {
	constructor(client: BulbBotClient, name: string) {
		super(client, {
			name,
			description: "Too be written",
			category: "Moderation",
			aliases: ["poolban"],
			usage: "<user> <force> <reason>",
			examples: ["crossban 123456789012345678 true rude user", "crossban 123456789012345678 false rude user", "crossban 123456789012345678 true rude user"],
			argList: ["user:User", "force:true|false", "reason:string"],
			minArgs: 3,
			maxArgs: -1,
			clearance: 75,
			clientPerms: ["BAN_MEMBERS"],
			premium: true,
		});
	}

	async run(context: CommandContext, args: string[]): Promise<void | Message> {
		const targetID: Snowflake = args[0].replace(NonDigits, "");
		let infID: number = 0;
		let reason: string = args.slice(1).join(" ");
		let target: User;

		if (!reason) reason = await this.client.bulbutils.translate("global_no_reason", context.guild?.id, {});
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

		for (let i = 0; i < poolGuilds.length; i++) {
			const gId = poolGuilds[i];
			const guild: Guild = await this.client.guilds.fetch(gId)!;

			await loggingManager.sendEventLog(
				this.client,
				guild,
				"banpool",
				await this.client.bulbutils.translate("global_mod_action_log", gId, {
					action: await this.client.bulbutils.translate("mod_action_types.pool_ban", gId, {}),
					moderator: context.author,
					target,
					reason,
				}),
			);

			await infractionsManager.ban(
				this.client,
				guild,
				BanType.POOL,
				<User>target,
				<GuildMember>context.member,
				await this.client.bulbutils.translate("global_mod_action_log", gId, {
					action: await this.client.bulbutils.translate("mod_action_types.pool_ban", gId, {}),
					moderator: context.author,
					target,
					reason,
				}),
				reason,
			);
		}
	}
}
