import Command from "../../structures/Command";
import { Guild, GuildMember, Message } from "discord.js";
import { NonDigits, UserMentionAndID } from "../../utils/Regex";
import { massCommandSleep } from "../../structures/Config";
import InfractionsManager from "../../utils/managers/InfractionsManager";

const infractionsManager: InfractionsManager = new InfractionsManager();

export default class extends Command {
	constructor(...args) {
		// @ts-ignore
		super(...args, {
			description: "Unbans multiple people from a guild",
			category: "Moderation",
			aliases: ["munban"],
			usage: "!multiunban <user> <user2>... [reason]",
			examples: [
				"multiunban 123456789012345678 123456789012345678 nice user",
				"multiunban @Wumpus#0000 @Nelly##0000 nice user",
			],
			argList: ["user:User"],
			minArgs: 1,
			maxArgs: -1,
			clearance: 50,
			userPerms: ["BAN_MEMBERS"],
			clientPerms: ["BAN_MEMBERS"],
		});
	}

	public async run(message: Message, args: string[]): Promise<void | Message> {
		const targets: RegExpMatchArray = <RegExpMatchArray>args.slice(0).join(" ").match(UserMentionAndID);
		let reason: string = args.slice(targets.length).join(" ").replace(UserMentionAndID, "");

		if (reason === "") reason = await this.client.bulbutils.translate("global_no_reason", message.guild?.id);
		let fullList: string = "";

		if (targets!!.length <= 1) {
			await message.channel.send(await this.client.bulbutils.translate("multiunban_targets_too_few", message.guild?.id))
			return await this.client.commands.get("unban")!.run(message, args);
		}

		message.channel.send(await this.client.bulbutils.translate("global_loading", message.guild?.id)).then(msg => {
			msg.delete({ timeout: (args.length - 0.5) * massCommandSleep });
		});

		for (let i = 0; i < targets.length; i++) {
			if (targets[i] === undefined) continue;
			await this.client.bulbutils.sleep(massCommandSleep);

			let target;
			let infID: number;
			try {
				target = await this.client.users.fetch(targets[i].replace(NonDigits, ""));
			} catch (error) {
				await message.channel.send(await this.client.bulbutils.translate("global_user_not_found", message.guild?.id));
			}

			infID = await infractionsManager.unban(
				this.client,
				<Guild>message.guild,
				target,
				<GuildMember>message.member,
				await this.client.bulbutils.translate("global_mod_action_log", message.guild?.id, {
					action: "Unban",
					moderator_tag: message.author.tag,
					moderator_id: message.author.id,
					target_tag: target.tag,
					target_id: target.id,
					reason,
				}),
				reason,
			);

			fullList += ` **${target.tag}** \`\`(${target.id})\`\` \`\`[#${infID}]\`\``;
		}

		return message.channel.send(
			await this.client.bulbutils.translate("multiunban_success", message.guild?.id, {
				full_list: fullList,
				reason,
			}),
		);
	}
}