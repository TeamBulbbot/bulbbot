import Command from "../../structures/Command";
import CommandContext from "../../structures/CommandContext";
import { GuildMember, Snowflake } from "discord.js";
import { NonDigits } from "../../utils/Regex";
import InfractionsManager from "../../utils/managers/InfractionsManager";
import { BanType } from "../../utils/types/BanType";
import BulbBotClient from "../../structures/BulbBotClient";

const infractionsManager: InfractionsManager = new InfractionsManager();

export default class extends Command {
	constructor(client: BulbBotClient, name: string) {
		super(client, {
			name,
			description: "Bans a user and removes all their messages from the server",
			category: "Moderation",
			usage: "<member> [reason]",
			examples: ["cleanban 123456789012345678", "softban 123456789012345678 rude user", "softban @Wumpus#0000 rude user"],
			argList: ["member:Member", "reason:String"],
			minArgs: 1,
			maxArgs: -1,
			clearance: 50,
			userPerms: ["BAN_MEMBERS"],
			clientPerms: ["BAN_MEMBERS"],
		});
	}

	async run(context: CommandContext, args: string[]): Promise<void> {
		const targetID: Snowflake = args[0].replace(NonDigits, "");
		const target: GuildMember | undefined = await this.client.bulbfetch.getGuildMember(context.guild?.members, targetID);
		let reason: string = args.slice(1).join(" ");

		if (!target) {
			await context.channel.send(
				await this.client.bulbutils.translate("global_not_found", context.guild?.id, {
					type: await this.client.bulbutils.translate("global_not_found_types.member", context.guild?.id, {}),
					arg_expected: "member:Member",
					arg_provided: args[0],
					usage: this.usage,
				}),
			);
			return;
		}
		if (await this.client.bulbutils.resolveUserHandle(context, this.client.bulbutils.checkUser(context, target), target.user)) return;

		const banList = await context.guild?.bans.fetch();
		const bannedUser = banList?.find((user) => user.user.id === targetID);

		if (!reason) reason = await this.client.bulbutils.translate("global_no_reason", context.guild?.id, {});

		if (bannedUser) {
			await context.channel.send(
				await this.client.bulbutils.translate("already_banned", context.guild?.id, {
					target,
					reason: bannedUser.reason,
				}),
			);
			return;
		}

		if (!context.guild?.id || !context.member) return;

		const infID = await infractionsManager.ban(
			this.client,
			context.guild,
			BanType.CLEAN,
			target.user,
			context.member,
			await this.client.bulbutils.translate("global_mod_action_log", context.guild?.id, {
				action: await this.client.bulbutils.translate("mod_action_types.ban", context.guild?.id, {}),
				moderator: context.author,
				target,
				reason,
			}),
			reason,
		);

		await context.channel.send(
			await this.client.bulbutils.translate("action_success", context.guild?.id, {
				action: await this.client.bulbutils.translate("mod_action_types.ban", context.guild?.id, {}),
				target: target.user,
				reason,
				infraction_id: infID,
			}),
		);
	}
}
