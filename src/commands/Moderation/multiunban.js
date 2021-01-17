const Command = require("../../structures/Command");
const { Unban } = require("../../utils/moderation/actions");
const { UserMentionStrict, NonDigits } = require("../../utils/Regex");

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			description: "Unbans multiple people from a guild",
			category: "Moderation",
			aliases: ["munban"],
			usage: "!multiunban <user> <user2>... [reason]",
			examples: [
				"multiunban @mrphilip#0001 @Kluk##6589",
				"multiunban 190160914765316096 439396770695479297 nice user",
				"multiunban @mrphilip#0001 @Kluk##6589 nice user",
			],
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
			let target;
			let infId = null;
			try {
				target = await this.client.users.fetch(targets[i].replace(NonDigits, ""));
			} catch (error) {
				message.channel.send(this.client.bulbutils.translate("global_user_not_found"));
			}

			infId = await Unban(
				this.client,
				message.guild,
				target,
				message.author,
				this.client.bulbutils.translate("global_mod_action_log", {
					action: "Unban",
					moderator_tag: message.author.tag,
					moderator_id: message.author.id,
					target_tag: target.tag,
					target_id: target.id,
					reason,
				}),
				reason,
			);

			fullList += `**${target.tag}** \`\`(${target.id})\`\` \`\`[#${infId}]\`\` `;
		}

		return message.channel.send(
			this.client.bulbutils.translate("multiunban_success", {
				full_list: fullList,
				reason,
			}),
		);
	}
};
