import Command from "../../structures/Command";
import CommandContext from "../../structures/CommandContext";
import { Message, Snowflake } from "discord.js";
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
			description: "Bans or forcebans multiple people from a server",
			category: "Moderation",
			aliases: ["mban"],
			usage: "<user> <user2>.... [reason]",
			examples: ["multiban 123456789012345678 876543210987654321 rude user", "multiban @Wumpus00000 @Nelly##0000 rude user"],
			argList: ["user:User", "reason:String"],
			minArgs: 1,
			maxArgs: -1,
			clearance: 50,
			userPerms: ["BAN_MEMBERS"],
			clientPerms: ["BAN_MEMBERS"],
		});
	}

	public async run(context: CommandContext, args: string[]): Promise<void | Message> {
		let targets: RegExpMatchArray = args.slice(0).join(" ").match(UserMentionAndID) || [];
		targets = [...new Set(targets.map((target) => target.replace(NonDigits, "")))];

		if (!targets.length)
			return context.channel.send(
				await this.client.bulbutils.translate("action_multi_no_targets", context.guild?.id, {
					usage: this.usage,
				}),
			);

		let reason: string = args.slice(targets.length).join(" ").replace(UserMentionAndID, "");

		if (reason === "") reason = await this.client.bulbutils.translate("global_no_reason", context.guild?.id, {});
		const fullList: string[] = [];

		if (targets.length <= 1) {
			await context.channel.send(
				await this.client.bulbutils.translate("action_multi_less_than_2", context.guild?.id, {
					action: await this.client.bulbutils.translate("action_multi_types.ban", context.guild?.id, {}),
				}),
			);
			//return await this.client.commands.get("ban")?.run(context, args);
		}

		context.channel.send(await this.client.bulbutils.translate("global_loading", context.guild?.id, {})).then((msg) => {
			setTimeout(() => msg.delete(), (args.length - 0.5) * massCommandSleep);
		});

		if (!context.guild?.id || !context.member) return;

		for (let i = 0; i < targets.length; i++) {
			if (targets[i] === undefined) continue;
			await this.client.bulbutils.sleep(massCommandSleep);

			const t: Snowflake = targets[i].replace(NonDigits, "");
			let infID: number;
			let target: any = await this.client.bulbfetch.getGuildMember(context.guild.members, t);
			const notInGuild = !target;

			if (!notInGuild) {
				if (await this.client.bulbutils.resolveUserHandle(context, this.client.bulbutils.checkUser(context, target), target.user)) return;
			}

			if (notInGuild) {
				target = await this.client.bulbfetch.getUser(t);
				if (!target) {
					await context.channel.send(
						await this.client.bulbutils.translate("global_not_found", context.guild.id, {
							type: await this.client.bulbutils.translate("global_not_found_types.user", context.guild.id, {}),
							arg_expected: "user:User",
							arg_provided: t,
							usage: this.usage,
						}),
					);
					continue;
				}

				infID = await infractionsManager.ban(
					this.client,
					context.guild,
					BanType.FORCE,
					target,
					context.member,
					await this.client.bulbutils.translate("global_mod_action_log", context.guild.id, {
						action: await this.client.bulbutils.translate("mod_action_types.force_ban", context.guild.id, {}),
						moderator: context.author,
						target,
						reason,
					}),
					reason,
				);
			} else {
				target = target.user;
				infID = await infractionsManager.ban(
					this.client,
					context.guild,
					BanType.NORMAL,
					target,
					context.member,
					await this.client.bulbutils.translate("global_mod_action_log", context.guild.id, {
						action: await this.client.bulbutils.translate("mod_action_types.ban", context.guild.id, {}),
						moderator: context.author,
						target,
						reason,
					}),
					reason,
				);
			}

			fullList.push(`**${target.tag}** \`\`(${target.id})\`\` \`\`[#${infID}]\`\``);
		}

		if (!fullList.length) return;

		return context.channel.send(
			await this.client.bulbutils.translate("action_success_multi", context.guild.id, {
				action: await this.client.bulbutils.translate("mod_action_types.ban", context.guild.id, {}),
				full_list: fullList.join(", "),
				reason,
			}),
		);
	}
}
