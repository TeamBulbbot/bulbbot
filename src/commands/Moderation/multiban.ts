import Command from "../../structures/Command";
import { Guild, GuildMember, Message, Snowflake } from "discord.js";
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

	public async run(message: Message, args: string[]): Promise<void | Message> {
		const targets: RegExpMatchArray = args.slice(0).join(" ").match(UserMentionAndID) ?? [];
		let reason: string = args.slice(targets.length).join(" ").replace(UserMentionAndID, "");

		if (reason === "") reason = await this.client.bulbutils.translate("global_no_reason", message.guild?.id, {});
		let fullList: string = "";

		if (targets.length <= 1) {
			await message.channel.send(
				await this.client.bulbutils.translate("action_multi_less_than_2", message.guild?.id, {
					action: await this.client.bulbutils.translate("action_multi_types.ban", message.guild?.id, {}),
				}),
			);
			return await this.client.commands.get("ban")!.run(message, args);
		}

		message.channel.send(await this.client.bulbutils.translate("global_loading", message.guild?.id, {})).then(msg => {
			msg.delete({ timeout: (args.length - 0.5) * massCommandSleep });
		});

		for (let i = 0; i < targets.length; i++) {
			if (targets[i] === undefined) continue;
			await this.client.bulbutils.sleep(massCommandSleep);

			const t: Snowflake = targets[i].replace(NonDigits, "");
			let infID: number;
			let target: any = await message.guild?.member(t);
			const notInGuild: boolean = !target;

			if (!notInGuild) {
				if (await this.client.bulbutils.resolveUserHandle(message, await this.client.bulbutils.checkUser(message, target), target.user)) return;
			}

			if (notInGuild) {
				try {
					target = await this.client.users.fetch(t);
				} catch (error) {
					await message.channel.send(
						await this.client.bulbutils.translate("global_not_found", message.guild?.id, {
							type: await this.client.bulbutils.translate("global_not_found_types.user", message.guild?.id, {}),
							arg_expected: "user:User",
							arg_provided: t,
							usage: this.usage,
						}),
					);
					continue;
				}
				infID = await infractionsManager.ban(
					this.client,
					<Guild>message.guild,
					BanType.FORCE,
					target,
					<GuildMember>message.member,
					await this.client.bulbutils.translate("global_mod_action_log", message.guild?.id, {
						action: await this.client.bulbutils.translate("mod_action_types.force_ban", message.guild?.id, {}),
						moderator: message.author,
						target,
						reason,
					}),
					reason,
				);
			} else {
				target = target.user;
				infID = await infractionsManager.ban(
					this.client,
					<Guild>message.guild,
					BanType.NORMAL,
					target,
					<GuildMember>message.member,
					await this.client.bulbutils.translate("global_mod_action_log", message.guild?.id, {
						action: await this.client.bulbutils.translate("mod_action_types.ban", message.guild?.id, {}),
						moderator: message.author,
						target,
						reason,
					}),
					reason,
				);
			}

			fullList += ` **${target.tag}** \`\`(${target.id})\`\` \`\`[#${infID}]\`\``;
		}

		return message.channel.send(
			await this.client.bulbutils.translate("action_success_multi", message.guild?.id, {
				action: await this.client.bulbutils.translate("mod_action_types.ban", message.guild?.id, {}),
				full_list: fullList,
				reason,
			}),
		);
	}
}
