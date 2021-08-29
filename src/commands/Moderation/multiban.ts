import Command from "../../structures/Command";
import CommandContext from "../../structures/CommandContext";
import { Guild, GuildMember, Message, User } from "discord.js";
import { NonDigits, UserMentionAndID } from "../../utils/Regex";
import { massCommandSleep } from "../../Config";
import InfractionsManager from "../../utils/managers/InfractionsManager";
import { BanType } from "../../utils/types/BanType";
import BulbBotClient from "../../structures/BulbBotClient";

const infractionsManager: InfractionsManager = new InfractionsManager();

export default class extends Command {
	constructor(client: BulbBotClient, name: string) {
		super(client, {
			name,
			description: "Bans or forcebans multiple people from a guild",
			category: "Moderation",
			aliases: ["mban"],
			usage: "<user> <user2>.... [reason]",
			examples: ["multiban 123456789012345678 123456789012345678 rude user", "multiban @Wumpus00000 @Nelly##0000 rude user"],
			argList: ["user:User"],
			minArgs: 1,
			maxArgs: -1,
			clearance: 50,
			userPerms: ["BAN_MEMBERS"],
			clientPerms: ["BAN_MEMBERS"],
		});
	}

	public async run(context: CommandContext, args: string[]): Promise<void | Message> {
		const potentialTargets: RegExpMatchArray = <RegExpMatchArray>args.slice(0).join(" ").match(UserMentionAndID);
		let validTargets: (GuildMember | User)[] = [];
		let invalidTargets: number = 0;
		let fullList: string = "";
		let reason: string = args.slice(potentialTargets?.length).join(" ").replace(UserMentionAndID, "");

		if (reason === "") reason = await this.client.bulbutils.translate("global_no_reason", context.guild?.id, {});

		for (const potentialTarget of potentialTargets) {
			const t = potentialTarget.replace(NonDigits, "");
			if (!t.length) continue;

			let target: User | GuildMember | null = t ? <GuildMember>await context.guild?.members.fetch(t).catch(() => null) : null;

			if (!target) {
				try {
					target = await this.client.users.fetch(t);
				} catch (error) {
					invalidTargets++;
					continue;
				}
			}

			if (target instanceof GuildMember)
				if (await this.client.bulbutils.resolveUserHandle(context, await this.client.bulbutils.checkUser(context, target), target.user)) continue;

			validTargets.push(target);
		}

		if (validTargets.length === 1) {
			await context.channel.send(
				await this.client.bulbutils.translate("action_multi_less_than_2", context.guild?.id, {
					action: await this.client.bulbutils.translate("action_multi_types.ban", context.guild?.id, {}),
				}),
			);
			return this.client.commands.get("ban")!.run(context, [validTargets[0].id, ...reason.split(" ")]);
		}

		const msg: Message = await context.channel.send(await this.client.bulbutils.translate("global_loading", context.guild?.id, {}));

		for (const target of validTargets) {
			await this.client.bulbutils.sleep(massCommandSleep);

			if (target instanceof GuildMember) {
				const infID = await infractionsManager.ban(
					this.client,
					<Guild>context.guild,
					BanType.NORMAL,
					target.user,
					<GuildMember>context.member,
					await this.client.bulbutils.translate("global_mod_action_log", context.guild?.id, {
						action: await this.client.bulbutils.translate("mod_action_types.ban", context.guild?.id, {}),
						moderator: context.author,
						target: target.user,
						reason,
					}),
					reason,
				);

				fullList += ` **${target.user.tag}** \`\`(${target.user.id})\`\` \`\`[#${infID}]\`\``;
			} else {
				const infID = await infractionsManager.ban(
					this.client,
					<Guild>context.guild,
					BanType.FORCE,
					target,
					<GuildMember>context.member,
					await this.client.bulbutils.translate("global_mod_action_log", context.guild?.id, {
						action: await this.client.bulbutils.translate("mod_action_types.force_ban", context.guild?.id, {}),
						moderator: context.author,
						target: target,
						reason,
					}),
					reason,
				);

				fullList += ` **${target.tag}** \`\`(${target.id})\`\` \`\`[#${infID}]\`\``;
			}
		}

		if (validTargets.length)
			await msg.edit(
				await this.client.bulbutils.translate("action_success_multi", context.guild?.id, {
					action: await this.client.bulbutils.translate("mod_action_types.ban", context.guild?.id, {}),
					full_list: fullList,
					reason,
				}),
			);
		else await msg.edit(await this.client.bulbutils.translate("action_multi_no_valid_targets", context.guild?.id, {}));

		if (invalidTargets !== 0)
			await context.channel.send(
				await this.client.bulbutils.translate("action_multi_invalid_targets", context.guild?.id, {
					amount: invalidTargets,
				}),
			);
	}
}
