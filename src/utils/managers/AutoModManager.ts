import BulbBotClient from "../../structures/BulbBotClient";
import { Guild, GuildMember, Message, Snowflake, User } from "discord.js";
import InfractionsManager from "./InfractionsManager";
import AutoModException from "../../structures/exceptions/AutoModException";
import { BanType } from "../types/BanType";

const infractionsManager: InfractionsManager = new InfractionsManager();

export default class {
	async resolveAction(client: BulbBotClient, message: Message, action: string, reason: string): Promise<string> {
		const target = {
			user: {
				tag: message.author.tag,
				id: message.author.id,
			},
		};

		switch (action.toUpperCase()) {
			case "LOG":
				break;
			case "WARN":
				await infractionsManager.warn(
					client,
					<Snowflake>message.guild?.id,
					<GuildMember>target,
					<GuildMember>message.guild?.me,
					await client.bulbutils.translateNew("global_mod_action_log", message.guild?.id, {
						action: await client.bulbutils.translateNew("mod_action_types.warn", message.guild?.id, {}),
						moderator: client.user,
						target: target.user,
						reason,
					}),
					reason,
				);
				break;
			case "KICK":
				await infractionsManager.ban(
					client,
					<Guild>message.guild,
					BanType.SOFT,
					<User>target.user,
					<GuildMember>message.guild?.me,
					await client.bulbutils.translateNew("global_mod_action_log", message.guild?.id, {
						action: await client.bulbutils.translateNew("mod_action_types.kick", message.guild?.id, {}),
						moderator: client.user,
						target: target.user,
						reason,
					}),
					reason,
				);
				break;
			case "BAN":
				await infractionsManager.ban(
					client,
					<Guild>message.guild,
					BanType.CLEAN,
					<User>target.user,
					<GuildMember>message.guild?.me,
					await client.bulbutils.translateNew("global_mod_action_log", message.guild?.id, {
						action: await client.bulbutils.translateNew("mod_action_types.ban", message.guild?.id, {}),
						moderator: client.user,
						target: target.user,
						reason,
					}),
					reason,
				);
				break;
			default:
				throw new AutoModException(`${action.toUpperCase()} is not a valid resolvable AutoMod action!`);
		}

		return action.toUpperCase();
	}
}
