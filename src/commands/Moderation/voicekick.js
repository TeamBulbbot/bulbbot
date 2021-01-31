const Command = require("../../structures/Command");
const { Voicekick } = require("../../utils/moderation/actions");
const { NonDigits } = require("../../utils/Regex");

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			description: "Kicks a member from the Voice Channel they're connected to",
			category: "Moderation",
			usage: "!voicekick <member> [reason]",
			examples: ["voicekick 190160914765316096", "voicekick 190160914765316096 rude user", "voicekick @mrphilip#0001 rude user"],
			aliases: ["vckick"],
			argList: ["member:Member"],
			minArgs: 1,
			maxArgs: -1,
			clearance: 50,
			userPerms: ["MOVE_MEMBERS"],
			clientPerms: ["MOVE_MEMBERS"],
		});
	}

	async run(message, args) {
		const targetId = args[0].replace(NonDigits, "");
		let target = message.guild.member(targetId);
		let reason = args.slice(1).join(" ");
		let infId = null;

		if (!reason) reason = await this.client.bulbutils.translate("global_no_reason");
		if (!target) return message.channel.send(await this.client.bulbutils.translate("global_user_not_found"));
		if (!target.voice.channel) return message.channel.send(await this.client.bulbutils.translate("global_not_in_voice"));

		infId = await Voicekick(
			this.client,
			message.guild,
			target,
			message.author,
			await this.client.bulbutils.translate("global_mod_action_log", {
				action: "Voice-kicked",
				moderator_tag: message.author.tag,
				moderator_id: message.author.id,
				target_tag: target.user.tag,
				target_id: target.user.id,
				reason,
			}),
			reason,
		);

		return message.channel.send(
			await this.client.bulbutils.translate("voicekick_success", {
				target_tag: target.user.tag,
				target_id: target.user.id,
				reason,
				infractionId: infId,
			}),
		);
	}
};
