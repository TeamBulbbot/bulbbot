const Command = require("../../structures/Command");
const { Voicekick } = require("../../utils/moderation/actions");
const { NonDigits, UserMentionStrict } = require("../../utils/Regex");

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			description: "Kicks multiple members from the Voice Channel they're connected to",
			category: "Moderation",
			usage: "!multivoicekick <member> <member2>... [reason]",
			examples: [
				"multivoicekick @mrphilip#0001 @Kluk##6589",
				"multivoicekick 190160914765316096 439396770695479297 rude user",
				"multivoicekick @mrphilip#0001 @Kluk##6589 rude user",
			],
			aliases: ["mvckick"],
			argList: ["member:Member"],
			minArgs: 1,
			maxArgs: -1,
			clearance: 50,
			userPerms: ["MOVE_MEMBERS"],
			clientPerms: ["MOVE_MEMBERS"],
		});
	}

	async run(message, args) {
		const targets = args.slice(0).join(" ").match(UserMentionStrict);
		let reason = args.slice(targets.length).join("").replace(UserMentionStrict, "");

		if (!reason) reason = await this.client.bulbutils.translate("global_no_reason");
		let fullList = "";

		for (let i = 0; i < targets.length; i++) {
			const t = targets[i].replace(NonDigits, "");
			const target = await message.guild.member(t);
			let infId;

			if (!target) {
				message.channel.send(await this.client.bulbutils.translate("global_user_not_found"));
				return;
			}
			if (!target.voice.channel) {
				message.channel.send(await this.client.bulbutils.translate("global_not_in_voice"));
				return;
			}

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

			fullList += `**${target.user.tag}** \`\`(${target.user.id})\`\` \`\`[#${infId}]\`\` `;
		}

		return message.channel.send(
			await this.client.bulbutils.translate("multivoicekick_success", {
				full_list: fullList,
				reason,
			}),
		);
	}
};
