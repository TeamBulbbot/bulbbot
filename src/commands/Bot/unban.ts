import Command from "../../structures/Command";
import { Guild, GuildMember, Message, Snowflake, User } from "discord.js";
import { NonDigits } from "../../utils/Regex";
import InfractionsManager from "../../utils/managers/InfractionsManager";

const infractionsManager: InfractionsManager = new InfractionsManager();

export default class extends Command {
	constructor(...args) {
		// @ts-ignore
		super(...args, {
			description: "Unban a user from the guild",
			category: "Moderation",
			aliases: ["pardon"],
			usage: "!unban <user> [reason]",
			examples: ["unban 123456789012345678", "unban 123456789012345678 nice user", "unban @Wumpus#0000 nice user"],
			argList: ["user:User"],
			minArgs: 1,
			maxArgs: -1,
			clearance: 50,
			userPerms: ["BAN_MEMBERS"],
			clientPerms: ["BAN_MEMBERS"],
		});
	}

	async run(message: Message, args: string[]): Promise<void | Message> {
		const targetID: Snowflake = args[0].replace(NonDigits, "");
		let target: User;
		try {
			target = await this.client.users.fetch(targetID);
		} catch (error) {
			return message.channel.send(
				await this.client.bulbutils.translate("global_user_not_found", message.guild?.id, {
					arg_expected: "user:User",
					arg_provided: args[0],
					usage: this.usage,
				}),
			);
		}
		let reason: string = args.slice(1).join(" ");
		let infID: number;

		const banList = await message.guild?.fetchBans();
		const bannedUser = banList?.find(user => user.user.id === targetID);

		if (!bannedUser) {
			return message.channel.send(
				await this.client.bulbutils.translate("not_banned", message.guild?.id, {
					target_tag: target.tag,
					target_id: target.id,
				}),
			);
		}
		if (!reason) reason = await this.client.bulbutils.translate("global_no_reason", message.guild?.id);

		infID = await infractionsManager.unban(
			this.client,
			<Guild>message.guild,
			target,
			<GuildMember>message.member,
			await this.client.bulbutils.translate("global_mod_action_log", message.guild?.id, {
				action: "Unban",
				moderator_tag: message.author.tag,
				moderator_id: message.author.id,
				target_tag: target.tag,
				target_id: target.id,
				reason,
			}),
			reason,
		);

		return message.channel.send(
			await this.client.bulbutils.translate("unban_success", message.guild?.id, {
				target_tag: target.tag,
				target_id: target.id,
				reason,
				infractionId: infID,
			}),
		);
	}
}
