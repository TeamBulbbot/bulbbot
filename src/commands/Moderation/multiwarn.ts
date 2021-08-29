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
		const potentialTargets: RegExpMatchArray = <RegExpMatchArray>args.slice(0).join(" ").match(UserMentionAndID);
		let validTargets: GuildMember[] = [];
		let invalidTargets: number = 0;
		let fullList: string[] = [];
		let reason: string = args.slice(potentialTargets?.length).join(" ").replace(UserMentionAndID, "");

		if (reason === "") reason = await this.client.bulbutils.translate("global_no_reason", context.guild?.id, {});

		for (const potentialTarget of potentialTargets) {
			const t = potentialTarget.replace(NonDigits, "");
			if (!t.length) continue;

			const target: GuildMember | null = t ? <GuildMember>await context.guild?.members.fetch(t).catch(() => null) : null;

			if (!target) {
				invalidTargets++;
				continue;
			}

			if (await this.client.bulbutils.resolveUserHandle(context, await this.client.bulbutils.checkUser(context, target), target.user)) continue;

			validTargets = [...validTargets, target];
		}

		if (validTargets.length === 1) {
			await context.channel.send(
				await this.client.bulbutils.translate("action_multi_less_than_2", context.guild?.id, {
					action: await this.client.bulbutils.translate("action_multi_types.warn", context.guild?.id, {}),
				}),
			);
			return this.client.commands.get("warn")!.run(context, [validTargets[0].id, ...reason.split(" ")]);
		}

		for (const target of validTargets) {
			const infID = await infractionsManager.warn(
				this.client,
				<Snowflake>context.guild?.id,
				target,
				<GuildMember>context.member,
				await this.client.bulbutils.translate("global_mod_action_log", context.guild?.id, {
					action: await this.client.bulbutils.translate("mod_action_types.warn", context.guild?.id, {}),
					moderator: context.author,
					target: target.user,
					reason,
				}),
				reason,
			);

			fullList.push(`**${target.user.tag}** \`\`(${target.user.id})\`\` \`\`[#${infID}]\`\``);
		}

		if (validTargets.length)
			await context.channel.send(
				await this.client.bulbutils.translate("action_success_multi", context.guild?.id, {
					action: await this.client.bulbutils.translate("mod_action_types.warn", context.guild?.id, {}),
					full_list: fullList,
					reason,
				}),
			);
		else await context.channel.send(await this.client.bulbutils.translate("action_multi_no_valid_targets", context.guild?.id, {}));

		if (invalidTargets !== 0)
			await context.channel.send(
				await this.client.bulbutils.translate("action_multi_invalid_targets", context.guild?.id, {
					amount: invalidTargets,
				}),
			);
	}
}
