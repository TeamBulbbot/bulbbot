import BulbBotClient from "../../structures/BulbBotClient";
import { Guild, GuildMember, Snowflake, User } from "discord.js";
import InfractionsManager from "./InfractionsManager";
import AutoModException from "../../structures/exceptions/AutoModException";
import { BanType } from "../types/BanType";
import CommandContext from "../../structures/CommandContext";

const infractionsManager: InfractionsManager = new InfractionsManager();

export default class {
	async resolveAction(client: BulbBotClient, context: CommandContext, action: string, reason: string): Promise<string> {
		let target: any = {
			user: {
				tag: context.author.tag,
				id: context.author.id,
			},
		};

		// action has been null in the past adding some safeguarding and just returning a LOG
		// until we have valid repro for this
		if (action === null) {
			client.log.error(`[Auto Mod Manager] Action is null in ${context.guild?.id}, reason: ${reason}, target ${target.user.tag} (${target.user.id})`);
			return "LOG";
		}

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
				target = await client.bulbfetch.getGuildMember(context.guild?.members, context.author.id);
				await infractionsManager.kick(
					client,
					context.guild!.id,
					target,
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

	async resolveActionWithoutContext(client: BulbBotClient, member: GuildMember, action: string, reason: string): Promise<string> {
		if (action === null) {
			client.log.error(`[Auto Mod Manager] Action is null in ${member.guild?.id}, reason: ${reason}, target ${member.user.tag} (${member.user.id})`);
			return "LOG";
		}

		switch (action.toUpperCase()) {
			case "LOG":
				break;
			case "WARN":
				await infractionsManager.warn(
					client,
					<Snowflake>member.guild?.id,
					member.user,
					<GuildMember>member.guild?.me,
					await client.bulbutils.translate("global_mod_action_log", member.guild?.id, {
						action: await client.bulbutils.translate("mod_action_types.warn", member.guild?.id, {}),
						moderator: client.user,
						target: member.user,
						reason,
					}),
					reason,
				);
				break;
			case "KICK":
				await infractionsManager.kick(
					client,
					member.guild!.id,
					member,
					<GuildMember>member.guild?.me,
					await client.bulbutils.translate("global_mod_action_log", member.guild?.id, {
						action: await client.bulbutils.translate("mod_action_types.kick", member.guild?.id, {}),
						moderator: client.user,
						target: member.user,
						reason,
					}),
					reason,
				);
				break;
			case "BAN":
				await infractionsManager.ban(
					client,
					<Guild>member.guild,
					BanType.CLEAN,
					<User>member.user,
					<GuildMember>member.guild?.me,
					await client.bulbutils.translate("global_mod_action_log", member.guild?.id, {
						action: await client.bulbutils.translate("mod_action_types.ban", member.guild?.id, {}),
						moderator: client.user,
						target: member.user,
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
