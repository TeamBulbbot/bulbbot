import Command from "../../structures/Command";
import { Collection, Guild, GuildMember, Message, Snowflake, User } from "discord.js";
import { NonDigits } from "../../utils/Regex";
import InfractionsManager from "../../utils/managers/InfractionsManager";
import { BanType } from "../../utils/types/BanType";

const infractionsManager: InfractionsManager = new InfractionsManager();

export default class extends Command {
	constructor(...args) {
		// @ts-ignore
		super(...args, {
			description: "Bans or forcebans a user from the guild",
			category: "Moderation",
			aliases: ["terminate", "yeet"],
			usage: "!ban <user> [reason]",
			examples: ["ban 123456789012345678", "ban 123456789012345678 rude user", "ban @Wumpus#0000 rude user"],
			argList: ["user:User"],
			minArgs: 1,
			maxArgs: -1,
			clearance: 50,
			userPerms: ["BAN_MEMBERS"],
			clientPerms: ["BAN_MEMBERS"],
		});
	}

	async run(message: Message, args: string[]): Promise<void> {
		//Variable declarations
		const targetID: Snowflake = args[0].replace(NonDigits, "");
		let target: any = message.guild?.member(targetID);
		let reason: string = args.slice(1).join(" ");
		let notInGuild: boolean = !target;
		let infID: number;

		if (!notInGuild) {
			if (await this.client.bulbutils.resolveUserHandle(message, this.client.bulbutils.checkUser(message, target), target.user)) return;
		}

		//Fetches the ban list
		const banList: Collection<string, { user: User; reason: string }> | undefined = await message.guild?.fetchBans();
		const bannedUser = banList?.find(user => user.user.id === targetID);

		//If the user is already banned return with a message
		if (bannedUser) {
			await message.channel.send(
				await this.client.bulbutils.translate("already_banned", message.guild?.id, {
					target_tag: bannedUser.user.tag,
					target_id: bannedUser.user.id,
					reason: bannedUser.reason.split("Reason: ")[1],
				}),
			);
			return;
		}
		if (!reason) reason = await this.client.bulbutils.translate("global_no_reason", message.guild?.id, {});
		if (!target) {
			try {
				target = await this.client.users.fetch(targetID);
			} catch (error) {
				await message.channel.send(
					await this.client.bulbutils.translate("global_user_not_found", message.guild?.id, {
						arg_expected: "user:User",
						arg_provided: args[0],
						usage: this.usage,
					}),
				);
				return;
			}
		}

		//If the user is not in the guild force ban
		if (notInGuild) {
			infID = await infractionsManager.ban(
				this.client,
				<Guild>message.guild,
				BanType.FORCE,
				<User>target,
				<GuildMember>message.member,
				await this.client.bulbutils.translate("global_mod_action_log", message.guild?.id, {
					action: "Force-banned",
					moderator_tag: message.author.tag,
					moderator_id: message.author.id,
					target_tag: target.tag,
					target_id: target.id,
					reason,
				}),
				reason,
			);
		} else {
			//Else execute a normal ban
			target = target.user;
			infID = await infractionsManager.ban(
				this.client,
				<Guild>message.guild,
				BanType.NORMAL,
				target,
				<GuildMember>message.member,
				await this.client.bulbutils.translate("global_mod_action_log", message.guild?.id, {
					action: "Banned",
					moderator_tag: message.author.tag,
					moderator_id: message.author.id,
					target_tag: target.tag,
					target_id: target.id,
					reason,
				}),
				reason,
			);
		}

		//Sends the response message
		await message.channel.send(
			await this.client.bulbutils.translate("ban_success", message.guild?.id, {
				target_tag: target.tag,
				target_id: target.id,
				reason,
				infractionId: infID,
			}),
		);
	}
}
