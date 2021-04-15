const Command = require("../../structures/Command");
const { ChangeNick } = require("../../utils/moderation/actions");
const { UserMentionAndId, QuoteMarked } = require("../../utils/Regex");

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			description: "Nicknames a user from the current server",
			category: "Moderation",
			usage: "!nickname <member> [nickname] [reason]",
			argList: ["member:Member"],
			examples: ["!nickname @KlukCZ#6589 QT"],
			minArgs: 1,
			maxArgs: -1,
			clientPerms: ["MANAGE_NICKNAMES"],
		});
	}

	async run(message, args) {
		const argString = args.slice(1).join(" ");
		const match = UserMentionAndId.exec(args[0]);
		if (!match) return message.channel.send(await this.client.bulbutils.translate("global_user_not_found", message.guild.id));
		const targetId = match[1] ?? match[2];
		const target = message.guild.member(targetId);
		const nickmatch = QuoteMarked.exec(argString);
		const nickname = (nickmatch ? nickmatch[1] : args[1]).trim() ?? "";
		const reason = args.slice(1 + nickname.split(' ').length)?.join(" ").trim() || await this.client.bulbutils.translate("global_no_reason", message.guild.id);
		if (!target) return message.channel.send(await this.client.bulbutils.translate("global_user_not_found", message.guild.id));
		if (await this.client.bulbutils.ResolveUserHandle(message, await this.client.bulbutils.CheckUser(message, target), target.user)) return;

		if(nickname.length > 32) 
			return message.channel.send(await this.client.bulbutils.translate("nickname_too_long", message.guild.id, {
				nick_length: nickname.length.toString(),
			}));
		if(!nickname && !target.nickname)
			return message.channel.send(await this.client.bulbutils.translate("already_no_nickname", message.guild.id, {
				target_tag: target.user.tag,
				target_id: target.user.id,
			}));
		if(nickname === target.nickname)
			return message.channel.send(await this.client.bulbutils.translate("already_has_nickname", message.guild.id, {
				target_tag: target.user.tag,
				target_id: target.user.id,
				nick_new: target.nickname,
			}));


		const nickOld = target.nickname || target.user.username;
		let infId = null;
		try {
			infId = await ChangeNick(
				this.client,
				message.guild,
				target,
				message.author,
				await this.client.bulbutils.translate("global_mod_action_log", message.guild.id, {
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
		} catch(e) {
			console.error(e.stack)
			return message.channel.send(await this.client.bulbutils.translate("change_nick_fail", message.guild.id, {
				target_tag: target.user.tag,
				target_id: target.user.id,
			}));
		}

		return message.channel.send(
			await this.client.bulbutils.translate(nickname ? "change_nick_success" : "remove_nick_success", message.guild.id, {
				target_tag: target.user.tag,
				target_id: target.user.id,
				nick_old: nickOld,
				nick_new: nickname,
				moderator_tag: message.author.tag,
				moderator_id: message.author.id,
				reason,
				infractionId: infId,
			}),
		);
	}
};
