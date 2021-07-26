import Command from "../../structures/Command";
import { Guild, GuildMember, Message, Snowflake } from "discord.js";
import { QuoteMarked, UserMentionAndID } from "../../utils/Regex";
import InfractionsManager from "../../utils/managers/InfractionsManager";

const infractionsManager: InfractionsManager = new InfractionsManager();

export default class extends Command {
	constructor(...args) {
		// @ts-ignore
		super(...args, {
			description: "Nicknames a user from the current server",
			category: "Moderation",
			aliases: ["nick"],
			usage: "!nickname <member> [nickname] [reason]",
			argList: ["member:Member"],
			examples: ["!nickname @Wumpus#0000 QT"],
			minArgs: 1,
			maxArgs: -1,
			clearance: 50,
			clientPerms: ["MANAGE_NICKNAMES"],
		});
	}

	public async run(message: Message, args: string[]): Promise<void | Message> {
		const argString: string = args.slice(1).join(" ");
		UserMentionAndID.lastIndex = 0;
		const match: RegExpMatchArray = <RegExpMatchArray>UserMentionAndID.exec(args[0]);
		if (!match) return message.channel.send(await this.client.bulbutils.translate("global_user_not_found", message.guild?.id));
		const targetID: Snowflake = match[1] ?? match[2];
		const target: GuildMember = <GuildMember>message.guild?.member(targetID);
		const nickmatch: RegExpMatchArray = <RegExpMatchArray>QuoteMarked.exec(argString);
		const nickname: string = (nickmatch ? nickmatch[1] : args[1]).trim() ?? "";
		const reason: string =
			args
				.slice(1 + nickname.split(" ").length)
				.join(" ")
				.trim() || (await this.client.bulbutils.translate("global_no_reason", message.guild?.id));
		if (!target) return message.channel.send(await this.client.bulbutils.translate("global_user_not_found", message.guild?.id));
		if (await this.client.bulbutils.resolveUserHandle(message, await this.client.bulbutils.checkUser(message, target), target.user)) return;

		if (nickname.length > 32)
			return message.channel.send(
				await this.client.bulbutils.translate("nickname_too_long", message.guild?.id, {
					nick_length: nickname.length.toString(),
				}),
			);
		if (!nickname && !target.nickname)
			return message.channel.send(
				await this.client.bulbutils.translate("already_no_nickname", message.guild?.id, {
					target_tag: target.user.tag,
					target_id: target.user.id,
				}),
			);
		if (nickname === target.nickname)
			return message.channel.send(
				await this.client.bulbutils.translate("already_has_nickname", message.guild?.id, {
					target_tag: target.user.tag,
					target_id: target.user.id,
					nick_new: target.nickname,
				}),
			);

		const nickOld: string = target.nickname || target.user.username;
		let infID: number;
		try {
			infID = await infractionsManager.nickname(
				this.client,
				<Guild>message.guild,
				target,
				<GuildMember>message.member,
				await this.client.bulbutils.translate("global_mod_action_log", message.guild?.id, {
					action: nickname ? "Nickname changed" : "Nickname removed",
					moderator_tag: message.author.tag,
					moderator_id: message.author.id,
					target_tag: target.user.tag,
					target_id: target.user.id,
					reason,
				}),
				reason,
				nickOld,
				nickname,
			);
		} catch (e) {
			console.error(e.stack);
			return message.channel.send(
				await this.client.bulbutils.translate("change_nick_fail", message.guild?.id, {
					target_tag: target.user.tag,
					target_id: target.user.id,
				}),
			);
		}

		return message.channel.send(
			await this.client.bulbutils.translate(nickname ? "change_nick_success" : "remove_nick_success", message.guild?.id, {
				target_tag: target.user.tag,
				target_id: target.user.id,
				nick_old: nickOld,
				nick_new: nickname,
				moderator_tag: message.author.tag,
				moderator_id: message.author.id,
				reason,
				infractionId: infID,
			}),
		);
	}
}
