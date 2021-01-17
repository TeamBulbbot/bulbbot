const Command = require("../../structures/Command");
const { Warn } = require("../../utils/moderation/actions");
const { UserMentionStrict, NonDigits } = require("../../utils/Regex");

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			description: "Warns multiple selected users",
			category: "Moderation",
			aliases: ["mwarn"],
			usage: "!multiwarn <member> <member2>... [reason]",
			examples: [
				"multiwarn @mrphilip#0001 @Kluk##6589",
				"multiwarn 190160914765316096 439396770695479297 rude user",
				"multiwarn @mrphilip#0001 @Kluk##6589 rude user",
			],
			argList: ["user:User"],
			minArgs: 1,
			maxArgs: -1,
			clearance: 50,
		});
	}

	async run(message, args) {
		const targets = args.slice(0).join(" ").match(UserMentionStrict);
		let reason = args.slice(targets.length).join(" ").replace(UserMentionStrict, "");

		if (reason === "") reason = this.client.bulbutils.translate("global_no_reason");
		let fullList = "";

		for (let i = 0; i < targets.length; i++) {
			const t = targets[i].replace(NonDigits, "");
			const target = await message.guild.member(t);
			let infId;

			if (!target) {
				message.channel.send(this.client.bulbutils.translate("global_user_not_found"));
				continue;
			}

			infId = await Warn(
				this.client,
				message.guild,
				target,
				message.author,
				this.client.bulbutils.translate("global_mod_action_log", {
					action: "Warned",
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
			this.client.bulbutils.translate("multiwarn_success", {
				full_list: fullList,
				reason,
			}),
		);
	}
};
