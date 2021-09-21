import BulbBotClient from "../../structures/BulbBotClient";
import { Guild, GuildMember, Snowflake, User } from "discord.js";
import InfractionsManager from "./InfractionsManager";
import AutoModException from "../../structures/exceptions/AutoModException";
import { BanType } from "../types/BanType";
import CommandContext from "../../structures/CommandContext";

const infractionsManager: InfractionsManager = new InfractionsManager();

export default class {
	async resolveAction(client: BulbBotClient, context: CommandContext, action: string, reason: string): Promise<string> {
		const target = {
			user: {
				tag: context.author.tag,
				id: context.author.id,
			},
		};

		switch (action.toUpperCase()) {
			case "LOG":
				break;
			case "WARN":
				await infractionsManager.warn(
					client,
					<Snowflake>context.guild?.id,
					<User>target.user,
					<GuildMember>context.guild?.me,
					await client.bulbutils.translate("global_mod_action_log", context.guild?.id, {
						action: await client.bulbutils.translate("mod_action_types.warn", context.guild?.id, {}),
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
					<Guild>context.guild,
					BanType.SOFT,
					<User>target.user,
					<GuildMember>context.guild?.me,
					await client.bulbutils.translate("global_mod_action_log", context.guild?.id, {
						action: await client.bulbutils.translate("mod_action_types.kick", context.guild?.id, {}),
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
					<Guild>context.guild,
					BanType.CLEAN,
					<User>target.user,
					<GuildMember>context.guild?.me,
					await client.bulbutils.translate("global_mod_action_log", context.guild?.id, {
						action: await client.bulbutils.translate("mod_action_types.ban", context.guild?.id, {}),
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
