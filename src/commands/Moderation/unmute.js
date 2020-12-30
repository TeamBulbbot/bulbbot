const Command = require("../../structures/Command");
const { setActive, getLatestMute } = require("../../utils/InfractionUtils");
const { UnmuteManual } = require("../../utils/moderation/actions");
const { NonDigits } = require("../../utils/Regex");
const { getMuteRole } = require("../../utils/guilds/Guild");

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			description: "Unutes the selected user",
			category: "Moderation",
			usage: "!unmute <member> [reason]",
			argList: ["member:Member"],
			minArgs: 1,
			maxArgs: -1,
			clearance: 50,
		});
	}

	async run(message, args) {
		const targetId = args[0].replace(NonDigits, "");
		const target = message.guild.member(targetId);
		const muteRole = await getMuteRole(message.guild);
		let reason = args.slice(1).join(" ");
		let infId = null;

		if (!reason) reason = this.client.bulbutils.translate("global_no_reason");
		if (!muteRole) return message.channel.send(this.client.bulbutils.translate("mute_muterole_not_found"));
		if (!target) return message.channel.send(this.client.bulbutils.translate("global_user_not_found"));

		infId = await UnmuteManual(
			this.client,
			message.guild,
			target,
			message.author,
			this.client.bulbutils.translate("global_mod_action_log", {
				action: "Unmuted",
				moderator_tag: message.author.tag,
				moderator_id: message.author.id,
				target_tag: target.tag,
				target_id: target.id,
				reason: reason,
			}),
			reason,
			muteRole,
		);

		message.channel.send(
			this.client.bulbutils.translate("unmute_success", {
				target_tag: target.user.tag,
				target_id: target.user.id,
				reason,
				infractionId: infId,
			}),
		);

		await setActive(await getLatestMute(message.guild.id, target.id), "false");
	}
};
