const Command = require("../../structures/Command");
const { Unban } = require("../../utils/moderation/actions");
const { NonDigits } = require("../../utils/Regex");

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			description: "Unban a user from the guild",
			category: "Moderation",
			aliases: ["pardon"],
			usage: "!unban <user> [reason]",
			examples: ["unban 190160914765316096", "unban 190160914765316096 nice user", "unban @mrphilip#0001 nice user"],
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
		let target;
		try {
			target = await this.client.users.fetch(targetId);
		} catch (error) {
			return message.channel.send(await this.client.bulbutils.translate("global_user_not_found", message.guild.id));
		}
		let reason = args.slice(1).join(" ");
		let infId = null;

		const banList = await message.guild.fetchBans();
		const bannedUser = banList.find(user => user.user.id === targetId);

		if (!bannedUser) {
			return message.channel.send(
				await this.client.bulbutils.translate("not_banned", message.guild.id, {
					target_tag: target.tag,
					target_id: target.id,
				}),
			);
		}
		if (!reason) reason = await this.client.bulbutils.translate("global_no_reason", message.guild.id);

		infId = await Unban(
			this.client,
			message.guild,
			target,
			message.author,
			await this.client.bulbutils.translate("global_mod_action_log", message.guild.id, {
				action: "Unban",
				moderator_tag: message.author.tag,
				moderator_id: message.author.id,
				target_tag: target.tag,
				target_id: target.id,
				reason,
			}),
			reason,
		);

		return message.channel.send(
			await this.client.bulbutils.translate("unban_success", message.guild.id, {
				target_tag: target.tag,
				target_id: target.id,
				reason,
				infractionId: infId,
			}),
		);
	}
};
