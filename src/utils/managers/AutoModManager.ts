import BulbBotClient from "../../structures/BulbBotClient";
import { GuildMember, Message } from "discord.js";
import InfractionsManager from "./InfractionsManager";
import AutoModException from "../../structures/exceptions/AutoModException";
import { BanType } from "../types/BanType";

const infractionsManager: InfractionsManager = new InfractionsManager();

export default class {
	async resolveAction(client: BulbBotClient, message: Message, action: Nullable<string>, reason: string): Promise<string> {
		let target: any = {
			user: {
				tag: message.author.tag,
				id: message.author.id,
			},
		};

		if (!message.guild?.id || !message.guild.me || !client.user) {
			client.log.error(`[Auto Mod Manager] Guild is null, reason: ${reason}, target ${target.user.tag} (${target.user.id})`);
			return "LOG";
		}

		// action has been null in the past adding some safeguarding and just returning a LOG
		// until we have valid repro for this
		if (action === null) {
			client.log.error(`[Auto Mod Manager] Action is null in ${message.guild.id}, reason: ${reason}, target ${target.user.tag} (${target.user.id})`);
			return "LOG";
		}

		switch (action.toUpperCase()) {
			case "LOG":
				break;
			case "WARN":
				await infractionsManager.warn(
					client,
					message.guild,
					target.user,
					message.guild.me,
					await client.bulbutils.translate("global_mod_action_log", message.guild.id, {
						action: await client.bulbutils.translate("mod_action_types.warn", message.guild.id, {}),
						moderator: client.user,
						target: target.user,
						reason,
					}),
					reason,
				);
				break;
			case "KICK":
				target = await client.bulbfetch.getGuildMember(message.guild.members, message.author.id);
				await infractionsManager.kick(
					client,
					message.guild,
					target,
					message.guild.me,
					await client.bulbutils.translate("global_mod_action_log", message.guild.id, {
						action: await client.bulbutils.translate("mod_action_types.kick", message.guild.id, {}),
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
					message.guild,
					BanType.CLEAN,
					target.user,
					message.guild.me,
					await client.bulbutils.translate("global_mod_action_log", message.guild.id, {
						action: await client.bulbutils.translate("mod_action_types.ban", message.guild.id, {}),
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
					member.guild,
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
					member.guild,
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
