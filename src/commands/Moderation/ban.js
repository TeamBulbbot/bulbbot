const Command = require("../../structures/Command");
const { Ban, ForceBan } = require("../../utils/moderation/actions");

module.exports = class extends (
	Command
) {
	constructor(...args) {
		super(...args, {
			description: "Bans or forcebans a user from the guild",
			category: "Moderation",
			aliases: ["terminate", "yeet"],
			usage: "!ban <user> [reason]",
			argList: ["user:User"],
			minArgs: 1,
			maxArgs: -1,
			clearance: 50,
			userPerms: ["BAN_MEMBERS"],
			clientPerms: ["BAN_MEMBERS"],
		});
	}

	async run(message, args) {
		const targetId = args[0].replace(/\D/g, "");
		let target = message.guild.member(targetId);
		let reason = args.slice(1).join(" ");
		let notInGuild = !target;
		let infId = null;

		const banList = await message.guild.fetchBans();
		const bannedUser = banList.find(user => user.user.id === targetId);

		if (bannedUser) {
			return message.channel.send(
				this.client.bulbutils.translate("already_banned", {
					target_tag: bannedUser.user.tag,
					target_id: bannedUser.user.id,
					reason: bannedUser.reason,
				}),
			);
		}
		if (!reason) reason = this.client.bulbutils.translate("global_no_reason");
		if (!target) {
			try {
				target = await this.client.users.fetch(targetId);
			} catch (error) {
				return message.channel.send(this.client.bulbutils.translate("global_user_not_found"));
			}
		}

		if (notInGuild) {
			infId = await ForceBan(
				this.client,
				message.guild,
				target,
				message.author,
				this.client.bulbutils.translate("global_mod_action_log", {
					action: "Forcebanned",
					moderator_tag: message.author.tag,
					moderator_id: message.author.id,
					target_tag: target.tag,
					target_id: target.id,
					reason,
				}),
				reason,
			);
		} else {
			if (!target.bannable) {
				return message.channel.send(
					this.client.bulbutils.translate("ban_fail", {
						target_tag: target.user.tag,
						target_id: target.user.id,
					}),
				);
			}
			target = target.user;
			infId = await Ban(
				this.client,
				message.guild,
				target,
				message.author,
				this.client.bulbutils.translate("global_mod_action_log", {
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

		return message.channel.send(
			this.client.bulbutils.translate("ban_success", {
				target_tag: target.tag,
				target_id: target.id,
				reason,
				infractionId: infId,
			}),
		);
	}
};
