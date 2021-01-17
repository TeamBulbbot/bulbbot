const Command = require("../../structures/Command");
const { SoftBan } = require("../../utils/moderation/actions");
const { NonDigits } = require("../../utils/Regex");

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			description: "Bans and unbans a user from the guild",
			category: "Moderation",
			aliases: ["cleanban"],
			usage: "!softban <user> [reason]",
			examples: ["softban 190160914765316096", "softban 190160914765316096 rude user", "softban @mrphilip#0001 rude user"],
			argList: ["user:User"],
			minArgs: 1,
			maxArgs: -1,
			clearance: 50,
			userPerms: ["BAN_MEMBERS"],
			clientPerms: ["BAN_MEMBERS"],
		});
	}

	async run(message, args) {
		const targetId = args[0].replace(NonDigits, "");
		const target = message.guild.member(targetId);
		let reason = args.slice(1).join(" ");
		let infId = null;

		const banList = await message.guild.fetchBans();
		const bannedUser = banList.find(user => user.user.id === targetId);

		if (!target) return message.channel.send(this.client.bulbutils.translate("global_user_not_found"));
		if (!reason) reason = this.client.bulbutils.translate("global_no_reason");

		if (bannedUser) {
			return message.channel.send(
				this.client.bulbutils.translate("already_banned", {
					target_tag: bannedUser.user.tag,
					target_id: bannedUser.user.id,
					reason: bannedUser.reason,
				}),
			);
		}
		if (!target.bannable) {
			return message.channel.send(
				this.client.bulbutils.translate("ban_fail", {
					target_tag: target.user.tag,
					target_id: target.user.id,
				}),
			);
		}

		infId = await SoftBan(
			this.client,
			message.guild,
			target.user,
			message.author,
			this.client.bulbutils.translate("global_mod_action_log", {
				action: "Banned",
				moderator_tag: message.author.tag,
				moderator_id: message.author.id,
				target_tag: target.user.tag,
				target_id: target.user.id,
				reason,
			}),
			reason,
			7,
		);

		return message.channel.send(
			this.client.bulbutils.translate("softban_success", {
				target_tag: target.user.tag,
				target_id: target.user.id,
				reason,
				infractionId: infId,
			}),
		);
	}
};
