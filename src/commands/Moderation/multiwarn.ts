import Command from "../../structures/Command";
import CommandContext from "../../structures/CommandContext";
import { GuildMember, Message, Snowflake } from "discord.js";
import { NonDigits, UserMentionAndID } from "../../utils/Regex";
import InfractionsManager from "../../utils/managers/InfractionsManager";
import BulbBotClient from "../../structures/BulbBotClient";

const infractionsManager: InfractionsManager = new InfractionsManager();

export default class extends Command {
	constructor(client: BulbBotClient, name: string) {
		super(client, {
			name,
			description: "Warns multiple selected users",
			category: "Moderation",
			aliases: ["mwarn"],
			usage: "<member> <member2>... [reason]",
			examples: ["multiwarn 123456789012345678 123456789012345678 rude user", "multiwarn @Wumpus#0000 @Nelly##0000 rude user"],
			argList: ["user:User"],
			minArgs: 1,
			maxArgs: -1,
			clearance: 50,
		});
	}

	public async run(context: CommandContext, args: string[]): Promise<void | Message> {
		const targets: RegExpMatchArray = <RegExpMatchArray>args.slice(0).join(" ").match(UserMentionAndID);
		let reason: string = args.slice(targets?.length).join(" ").replace(UserMentionAndID, "");

		if (reason === "") reason = await this.client.bulbutils.translate("global_no_reason", context.guild?.id, {});
		let fullList: string = "";

		if (targets!!.length <= 1) {
			await context.channel.send(
				await this.client.bulbutils.translate("action_multi_less_than_2", context.guild?.id, {
					action: await this.client.bulbutils.translate("action_multi_types.warn", context.guild?.id, {}),
				}),
			);
			return await this.client.commands.get("warn")!.run(context, args);
		}

		for (let i = 0; i < targets!!.length; i++) {
			if (targets!![i] === undefined) continue;

			const t: string = targets!![i].replace(NonDigits, "");
			const target: GuildMember | undefined = await this.client.bulbfetch.getGuildMember(context.guild?.members, t);
			let infID: number;

			if (!target) {
				await context.channel.send(
					await this.client.bulbutils.translate("global_not_found", context.guild?.id, {
						type: await this.client.bulbutils.translate("global_not_found_types.member", context.guild?.id, {}),
						arg_expected: "member:Member",
						arg_provided: t,
						usage: this.usage,
					}),
				);
				continue;
			}
			if (await this.client.bulbutils.resolveUserHandle(context, await this.client.bulbutils.checkUser(context, target), target.user)) continue;

			infID = await infractionsManager.warn(
				this.client,
				<Snowflake>context.guild?.id,
				target.user,
				<GuildMember>context.member,
				await this.client.bulbutils.translate("global_mod_action_log", context.guild?.id, {
					action: await this.client.bulbutils.translate("mod_action_types.warn", context.guild?.id, {}),
					moderator: context.author,
					target: target.user,
					reason,
				}),
				reason,
			);

			fullList += ` **${target.user.tag}** \`\`(${target.user.id})\`\` \`\`[#${infID}]\`\``;
		}

		return context.channel.send(
			await this.client.bulbutils.translate("action_success_multi", context.guild?.id, {
				action: await this.client.bulbutils.translate("mod_action_types.warn", context.guild?.id, {}),
				full_list: fullList,
				reason,
			}),
		);
	}
}
