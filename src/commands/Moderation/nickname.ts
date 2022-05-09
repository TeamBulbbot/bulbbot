import Command from "../../structures/Command";
import CommandContext from "../../structures/CommandContext";
import { GuildMember, Message, Snowflake } from "discord.js";
import { QuoteMarked, UserMentionAndID } from "../../utils/Regex";
import InfractionsManager from "../../utils/managers/InfractionsManager";
import BulbBotClient from "../../structures/BulbBotClient";

const infractionsManager: InfractionsManager = new InfractionsManager();

export default class extends Command {
	constructor(client: BulbBotClient, name: string) {
		super(client, {
			name,
			description: "Nicknames a user from the current server",
			category: "Moderation",
			aliases: ["nick"],
			usage: "<member> [nickname] [reason]",
			argList: ["member:Member", "nickname:String", "reason:String"],
			examples: ["nickname @Wumpus#0000 Nellys best friend"],
			minArgs: 1,
			maxArgs: -1,
			clearance: 50,
			clientPerms: ["MANAGE_NICKNAMES"],
		});
	}

	public async run(context: CommandContext, args: string[]): Promise<void | Message> {
		const argString: string = args.slice(1).join(" ");
		UserMentionAndID.lastIndex = 0;
		const match = UserMentionAndID.exec(args[0]);
		if (!match)
			return context.channel.send(
				await this.client.bulbutils.translate("global_not_found", context.guild?.id, {
					type: await this.client.bulbutils.translate("global_not_found_types.member", context.guild?.id, {}),
					arg_expected: "member:Member",
					arg_provided: args[0],
					usage: this.usage,
				}),
			);
		const targetID: Snowflake = match[1] ?? match[2];
		const target: GuildMember | undefined = await this.client.bulbfetch.getGuildMember(context.guild?.members, targetID);
		const nickmatch = QuoteMarked.exec(argString);
		const nickname: string = (nickmatch ? nickmatch[1] : args[1]).trim() ?? "";
		const reason: string =
			args
				// Interaction commands will pass multi-word nicknames as a single argument (unless it is quoted, in which case it'll split the argument)
				.slice(1 + (nickmatch ? nickname.split(" ").length : 1))
				.join(" ")
				.trim() || (await this.client.bulbutils.translate("global_no_reason", context.guild?.id, {}));
		if (!target)
			return context.channel.send(
				await this.client.bulbutils.translate("global_not_found", context.guild?.id, {
					type: await this.client.bulbutils.translate("global_not_found_types.member", context.guild?.id, {}),
					arg_expected: "member:Member",
					arg_provided: args[0],
					usage: this.usage,
				}),
			);
		if (await this.client.bulbutils.resolveUserHandle(context, this.client.bulbutils.checkUser(context, target), target.user)) return;

		if (nickname.length > 32) return context.channel.send(await this.client.bulbutils.translate("nickname_too_long", context.guild?.id, { length: nickname.length.toString() }));
		if (!nickname && !target.nickname) return context.channel.send(await this.client.bulbutils.translate("nickname_no_nickname", context.guild?.id, { target: target.user }));
		if (nickname === target.nickname)
			return context.channel.send(await this.client.bulbutils.translate("nickname_same_nickname", context.guild?.id, { target: target.user, nickname: target.nickname }));

		if (!context.guild || !context.member) return;

		const nickOld: string = target.nickname || target.user.username;
		let infID: number;
		try {
			infID = await infractionsManager.nickname(
				this.client,
				context.guild,
				target,
				context.member,
				await this.client.bulbutils.translate("global_mod_action_log", context.guild.id, {
					action: nickname ? "Nickname changed" : "Nickname removed",
					moderator: context.author,
					target: target.user,
					reason,
				}),
				reason,
				nickOld,
				nickname,
			);
		} catch (e: any) {
			console.error(e.stack);
			return context.channel.send(await this.client.bulbutils.translate("nickname_fail", context.guild.id, { target: target.user }));
		}

		return context.channel.send(
			await this.client.bulbutils.translate(nickname ? "nickname_success" : "nickname_remove_success", context.guild.id, {
				target: target.user,
				nick_old: nickOld,
				nick_new: nickname,
				reason,
				infraction_id: infID,
			}),
		);
	}
}
