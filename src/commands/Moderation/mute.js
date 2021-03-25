const Command = require("../../structures/Command");
const { Mute, Unmute } = require("../../utils/moderation/actions");
const { NonDigits } = require("../../utils/Regex");
const { getMuteRole } = require("../../utils/guilds/Guild");
const utils = new (require("../../utils/BulbBotUtils"))();
const parse = require("parse-duration");
const { getActive, setActive } = require("../../utils/InfractionUtils");
module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			description: "Mutes the selected user",
			category: "Moderation",
			aliases: ["tempmute"],
			usage: "!mute <member> <duration> [reason]",
			examples: ["mute 190160914765316096 5m", "mute 190160914765316096 1h rude user", "mute @mrphilip#0001 24h rude user"],
			argList: ["member:Member", "duration:Duration"],
			minArgs: 2,
			maxArgs: -1,
			clearance: 50,
			clientPerms: ["MANAGE_ROLES"],
		});
	}
	async run(message, args) {
		const targetId = args[0].replace(NonDigits, "");
		const target = message.guild.member(targetId);
		const muteRole = await getMuteRole(message.guild);
		const duration = parse(args[1]);
		let reason = args.slice(2).join(" ");
		let infId = null;

		if (!target) return message.channel.send(await this.client.bulbutils.translate("global_user_not_found"));
		if (await this.client.bulbutils.ResolveUserHandle(message, await this.client.bulbutils.CheckUser(message, target), target.user)) return;

		if (!reason) reason = await this.client.bulbutils.translate("global_no_reason");
		if (!muteRole) return message.channel.send(await this.client.bulbutils.translate("mute_muterole_not_found"));
		if (target.roles.cache.find(role => role.id === muteRole))
			return message.channel.send(await this.client.bulbutils.translate("mute_already_muted"));
		if (duration < parse("0s") || duration === null) return message.channel.send(await this.client.bulbutils.translate("tempban_invalid_0s"));
		if (duration > parse("1y")) return message.channel.send(await this.client.bulbutils.translate("tempban_invalid_1y"));

		infId = await Mute(
			this.client,
			message.guild,
			target,
			message.author,
			await this.client.bulbutils.translate("global_mod_action_log", {
				action: "Muted",
				moderator_tag: message.author.tag,
				moderator_id: message.author.id,
				target_tag: target.tag,
				target_id: target.id,
				reason,
				until: Date.now() + parse(args[1]),
			}),
			reason,
			muteRole,
			Date.now() + parse(args[1]),
		);

		message.channel.send(
			await this.client.bulbutils.translate("mute_success", {
				target_tag: target.user.tag,
				target_id: target.user.id,
				reason,
				infractionId: infId,
			}),
		);

		//TEMPMUTE CREATE FUNCTION
		const client = this.client;
		setTimeout(async function () {
			if ((await getActive(infId)) === "false") return;
			await setActive(infId, "false");

			infId = await Unmute(
				client,
				message.guild,
				target,
				client.user,
				utils.translate("global_mod_action_log", {
					action: "Unmuted",
					moderator_tag: client.user.tag,
					moderator_id: client.user.id,
					target_tag: target.tag,
					target_id: target.id,
					reason: "Automatic unmute",
				}),
				"Automatic unmute",
				muteRole,
			);

			//TEMPMUTE DELETE FUNCTION
		}, duration);
	}
};
