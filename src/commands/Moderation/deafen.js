const Command = require("./../../structures/Command");
const { Deafen } = require("../../utils/moderation/actions");
const { NonDigits } = require("../../utils/Regex");

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			description: "Deafens a member from a Voice Channel they're connected to",
			category: "Moderation",
			usage: "!deafen <user> [reason]",
			examples: ["deafen 190160914765316096", "deafen 190160914765316096 rude user", "deafen @mrphilip#0001 rude user"],
			argList: ["user:User"],
			minArgs: 1,
			maxArgs: -1,
			clearance: 50,
			userPerms: ["DEAFEN_MEMBERS"],
			clientPerms: ["DEAFEN_MEMBERS"],
		});
	}

	async run(message, args) {
		const targetId = args[0].replace(NonDigits, "");
		let target = message.guild.member(targetId);
		let reason = args.slice(1).join(" ");
		let infId = null;

		if (await this.client.bulbutils.ResolveUserHandle(message, await this.client.bulbutils.CheckUser(message, target), target.user)) return;

		if (!reason) reason = await this.client.bulbutils.translate("global_no_reason", message.guild.id);
		if (!target) return message.channel.send(await this.client.bulbutils.translate("global_user_not_found", message.guild.id));
		if (!target.voice.channel) return message.channel.send(await this.client.bulbutils.translate("global_not_in_voice", message.guild.id));
		if (target.voice.serverDeaf) return message.channel.send(await this.client.bulbutils.translate("deafen_already_deaf", message.guild.id));

		infId = await Deafen(
			this.client,
			message.guild,
			target,
			message.author,
			await this.client.bulbutils.translate("global_mod_action_log", message.guild.id, {
				action: "Deafened",
				moderator_tag: message.author.tag,
				moderator_id: message.author.id,
				target_tag: target.user.tag,
				target_id: target.user.id,
				reason,
			}),
			reason,
		);

		return message.channel.send(
			await this.client.bulbutils.translate("deafen_success", message.guild.id, {
				target_tag: target.user.tag,
				target_id: target.user.id,
				reason,
				infractionId: infId,
			}),
		);
	}
};
