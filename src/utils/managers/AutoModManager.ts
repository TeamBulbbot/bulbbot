import BulbBotClient from "../../structures/BulbBotClient";
import { GuildMember } from "discord.js";
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

		if (!context.guild?.id || !context.guild.me || !client.user) {
			client.log.error(`[Auto Mod Manager] Guild is null, reason: ${reason}, target ${target.user.tag} (${target.user.id})`);
			return "LOG";
		}

		// action has been null in the past adding some safeguarding and just returning a LOG
		// until we have valid repro for this
		if (action === null) {
			client.log.error(`[Auto Mod Manager] Action is null in ${context.guild.id}, reason: ${reason}, target ${target.user.tag} (${target.user.id})`);
			return "LOG";
		}

		switch (action.toUpperCase()) {
			case "LOG":
				break;
			case "WARN":
				await infractionsManager.warn(
					client,
					context.guild.id,
					target.user,
					context.guild.me,
					await client.bulbutils.translate("global_mod_action_log", context.guild.id, {
						action: await client.bulbutils.translate("mod_action_types.warn", context.guild.id, {}),
						moderator: client.user,
						target: target.user,
						reason,
					}),
					reason,
				);
				break;
			case "KICK":
				target = await client.bulbfetch.getGuildMember(context.guild.members, context.author.id);
				await infractionsManager.kick(
					client,
					context.guild.id,
					target,
					context.guild.me,
					await client.bulbutils.translate("global_mod_action_log", context.guild.id, {
						action: await client.bulbutils.translate("mod_action_types.kick", context.guild.id, {}),
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
					context.guild,
					BanType.CLEAN,
					target.user,
					context.guild.me,
					await client.bulbutils.translate("global_mod_action_log", context.guild.id, {
						action: await client.bulbutils.translate("mod_action_types.ban", context.guild.id, {}),
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
		if (!member.guild.id || !member.guild.me || !client.user) {
			client.log.error(`[Auto Mod Manager] Guild is null, reason: ${reason}, target ${member.user.tag} (${member.user.id})`);
			return "LOG";
		}

		if (action === null) {
			client.log.error(`[Auto Mod Manager] Action is null in ${member.guild.id}, reason: ${reason}, target ${member.user.tag} (${member.user.id})`);
			return "LOG";
		}

		switch (action.toUpperCase()) {
			case "LOG":
				break;
			case "WARN":
				await infractionsManager.warn(
					client,
					member.guild.id,
					member.user,
					member.guild.me,
					await client.bulbutils.translate("global_mod_action_log", member.guild.id, {
						action: await client.bulbutils.translate("mod_action_types.warn", member.guild.id, {}),
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
					member.guild.id,
					member,
					member.guild.me,
					await client.bulbutils.translate("global_mod_action_log", member.guild.id, {
						action: await client.bulbutils.translate("mod_action_types.kick", member.guild.id, {}),
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
					member.guild,
					BanType.CLEAN,
					member.user,
					member.guild.me,
					await client.bulbutils.translate("global_mod_action_log", member.guild.id, {
						action: await client.bulbutils.translate("mod_action_types.ban", member.guild.id, {}),
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
