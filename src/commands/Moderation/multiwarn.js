const Command = require("../../structures/Command");
const { Warn } = require("../../utils/moderation/actions");
const { UserMentionAndId, NonDigits } = require("../../utils/Regex");

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
		const targets = args.slice(0).join(" ").match(UserMentionAndId);
		let reason = args.slice(targets.length).join(" ").replace(UserMentionAndId, "");

		if (reason === "") reason = await this.client.bulbutils.translate("global_no_reason", message.guild.id);
		let fullList = "";

		for (let i = 0; i < targets.length; i++) {
			if (targets[i] === undefined) continue;

			const t = targets[i].replace(NonDigits, "");
			const target = await message.guild.member(t);
			let infId;

			if (!target) {
				message.channel.send(await this.client.bulbutils.translate("global_user_not_found", message.guild.id));
				continue;
			}
			if (await this.client.bulbutils.ResolveUserHandle(message, await this.client.bulbutils.CheckUser(message, target), target.user)) continue;

			infId = await Warn(
				this.client,
				message.guild,
				target,
				message.author,
				await this.client.bulbutils.translate("global_mod_action_log", message.guild.id, {
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
			await this.client.bulbutils.translate("multiwarn_success", message.guild.id, {
				full_list: fullList,
				reason,
			}),
		);
	}
};
