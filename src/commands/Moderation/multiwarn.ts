import Command from "../../structures/Command";
import { GuildMember, Message, Snowflake } from "discord.js";
import { NonDigits, UserMentionAndID } from "../../utils/Regex";
import InfractionsManager from "../../utils/managers/InfractionsManager";

const infractionsManager: InfractionsManager = new InfractionsManager();

export default class extends Command {
	constructor(...args) {
		// @ts-ignore
		super(...args, {
			description: "Warns multiple selected users",
			category: "Moderation",
			aliases: ["mwarn"],
			usage: "!multiwarn <member> <member2>... [reason]",
			examples: [
				"multiwarn 123456789012345678 123456789012345678 rude user",
				"multiwarn @Wumous#0000 @Nelly##0000 rude user",
			],
			argList: ["user:User"],
			minArgs: 1,
			maxArgs: -1,
			clearance: 50,
		});
	}

	public async run(message: Message, args: string[]): Promise<void | Message> {
		const targets: RegExpMatchArray = <RegExpMatchArray>args.slice(0).join(" ").match(UserMentionAndID);
		let reason: string = args.slice(targets?.length).join(" ").replace(UserMentionAndID, "");

		if (reason === "") reason = await this.client.bulbutils.translate("global_no_reason", message.guild?.id);
		let fullList: string = "";

		if (targets!!.length <= 1) {
			await message.channel.send(await this.client.bulbutils.translate("multiwarn_targets_too_few", message.guild?.id))
			return await this.client.commands.get("warn")!.run(message, args);
		}

		for (let i = 0; i < targets!!.length; i++) {
			if (targets!![i] === undefined) continue;

			const t: string = targets!![i].replace(NonDigits, "");
			const target: GuildMember = <GuildMember>await message.guild?.member(t);
			let infID: number;

			if (!target) {
				await message.channel.send(await this.client.bulbutils.translate("global_user_not_found", message.guild?.id));
				continue;
			}
			if (await this.client.bulbutils.resolveUserHandle(message, await this.client.bulbutils.checkUser(message, target), target.user)) continue;

			infID = await infractionsManager.warn(
				this.client,
				<Snowflake>message.guild?.id,
				target,
				<GuildMember>message.member,
				await this.client.bulbutils.translate("global_mod_action_log", message.guild?.id, {
					action: "Warned",
					moderator_tag: message.author.tag,
					moderator_id: message.author.id,
					target_tag: target.user.tag,
					target_id: target.user.id,
					reason,
				}),
				reason,
			);

			fullList += ` **${target.user.tag}** \`\`(${target.user.id})\`\` \`\`[#${infID}]\`\``;
		}

		return message.channel.send(
			await this.client.bulbutils.translate("multiwarn_success", message.guild?.id, {
				full_list: fullList,
				reason,
			}),
		);
	}
}