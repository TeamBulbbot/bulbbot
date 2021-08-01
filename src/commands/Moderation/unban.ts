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

	public async run(message: Message, args: string[]): Promise<void | Message> {
		const targetID: Snowflake = args[0].replace(NonDigits, "");
		let target: User;
		try {
			target = await this.client.users.fetch(targetID);
		} catch (error) {
			return await message.channel.send(
				await this.client.bulbutils.translateNew("global_not_found", message.guild?.id, {
					type: await this.client.bulbutils.translateNew("global_not_found_types.user", message.guild?.id, {}),
					arg_provided: args[0],
					arg_expected: "user:User",
					usage: this.usage,
				}),
			);
		}
		let reason: string = args.slice(1).join(" ");
		let infID: number;

		const banList = await message.guild?.fetchBans();
		const bannedUser = banList?.find(user => user.user.id === targetID);

		if (!bannedUser) return message.channel.send(await this.client.bulbutils.translate("not_banned", message.guild?.id, { target }));

		if (!reason) reason = await this.client.bulbutils.translateNew("global_no_reason", message.guild?.id, {});

		infID = await infractionsManager.unban(
			this.client,
			<Guild>message.guild,
			target,
			<GuildMember>message.member,
			await this.client.bulbutils.translateNew("global_mod_action_log", message.guild?.id, {
				action: await this.client.bulbutils.translateNew("mod_action_types.unban", message.guild?.id, {}),
				moderator: message.author,
				target,
				reason,
			}),
			reason,
		);

		await message.channel.send(
			await this.client.bulbutils.translateNew("action_success", message.guild?.id, {
				action: await this.client.bulbutils.translateNew("mod_action_types.unban", message.guild?.id, {}),
				target,
				reason,
				infraction_id: infID,
			}),
		);
	}
}
