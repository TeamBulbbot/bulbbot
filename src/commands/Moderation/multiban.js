const Command = require("../../structures/Command");
const { Ban, ForceBan } = require("../../utils/moderation/actions");
const { UserMentionStrict, NonDigits } = require("../../utils/Regex");

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			description: "Bans or forcebans multiple people from a guild",
			category: "Moderation",
			aliases: ["mban"],
			usage: "!multiban <user> <user2>.... [reason]",
			argList: ["user:User"],
			minArgs: 1,
			maxArgs: -1,
			clearance: 50,
			userPerms: ["BAN_MEMBERS"],
			clientPerms: ["BAN_MEMBERS"],
		});
	}

	async run(message, args) {
		const targets = args.slice(0).join(" ").match(UserMentionStrict);
		let reason = args.slice(targets.length).join("").replace(UserMentionStrict, "");

		if (reason === "") reason = this.client.bulbutils.translate("global_no_reason");
		let fullList = "";

		for (let i = 0; i < targets.length; i++) {
			const t = targets[i].replace(NonDigits, "");
			let infId;
			let target = await message.guild.member(t);
			const notInGuild = !target;

			if (notInGuild) {
				try {
					target = await this.client.users.fetch(t);
				} catch (error) {
					message.channel.send(this.client.bulbutils.translate("global_user_not_found"));
					continue;
				}
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

			fullList += `**${target.tag}** \`\`(${target.id})\`\` \`\`[#${infId}]\`\` `;
		}

		return message.channel.send(
			this.client.bulbutils.translate("multiban_success", {
				full_list: fullList,
				reason,
			}),
		);
	}
};
