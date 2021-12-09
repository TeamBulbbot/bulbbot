import Command from "../../structures/Command";
import CommandContext from "../../structures/CommandContext";
import { Guild, GuildMember, Message, Snowflake, User } from "discord.js";
import { NonDigits } from "../../utils/Regex";
import InfractionsManager from "../../utils/managers/InfractionsManager";
import BulbBotClient from "../../structures/BulbBotClient";
import { BanType } from "../../utils/types/BanType";

const infractionsManager: InfractionsManager = new InfractionsManager();

export default class extends Command {
	constructor(client: BulbBotClient, name: string) {
		super(client, {
			name,
			description: "Unban a user from the server",
			category: "Moderation",
			aliases: ["pardon"],
			usage: "<user> [reason]",
			examples: ["unban 123456789012345678", "unban 123456789012345678 nice user", "unban @Wumpus#0000 nice user"],
			argList: ["user:User"],
			minArgs: 1,
			maxArgs: -1,
			clearance: 50,
			userPerms: ["BAN_MEMBERS"],
			clientPerms: ["BAN_MEMBERS"],
		});
	}

	public async run(context: CommandContext, args: string[]): Promise<void | Message> {
		const targetID: Snowflake = args[0].replace(NonDigits, "");
		let target: User | undefined = await this.client.bulbfetch.getUser(targetID);
		let reason: string = args.slice(1).join(" ");
		let infID: number;

		const banList = await context.guild?.bans.fetch();
		const bannedUser = banList?.find(user => user.user.id === targetID);

		if (!target)
			return await context.channel.send(
				await this.client.bulbutils.translate("global_not_found", context.guild?.id, {
					type: await this.client.bulbutils.translate("global_not_found_types.user", context.guild?.id, {}),
					arg_provided: args[0],
					arg_expected: "user:User",
					usage: this.usage,
				}),
			);
		if (!bannedUser) return context.channel.send(await this.client.bulbutils.translate("not_banned", context.guild?.id, { target }));

		if (!reason) reason = await this.client.bulbutils.translate("global_no_reason", context.guild?.id, {});

		infID = await infractionsManager.unban(
			this.client,
			<Guild>context.guild,
			BanType.MANUAL,
			target,
			<GuildMember>context.member,
			await this.client.bulbutils.translate("global_mod_action_log", context.guild?.id, {
				action: await this.client.bulbutils.translate("mod_action_types.unban", context.guild?.id, {}),
				moderator: context.author,
				target,
				reason,
			}),
			reason,
		);

		await context.channel.send(
			await this.client.bulbutils.translate("action_success", context.guild?.id, {
				action: await this.client.bulbutils.translate("mod_action_types.unban", context.guild?.id, {}),
				target,
				reason,
				infraction_id: infID,
			}),
		);
	}
}
