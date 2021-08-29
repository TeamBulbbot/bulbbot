import Command from "../../structures/Command";
import CommandContext from "../../structures/CommandContext";
import { Guild, GuildMember, Message, User } from "discord.js";
import { NonDigits, UserMentionAndID } from "../../utils/Regex";
import InfractionsManager from "../../utils/managers/InfractionsManager";
import BulbBotClient from "../../structures/BulbBotClient";
import { BanType } from "../../utils/types/BanType";
import { massCommandSleep } from "../../Config";

const infractionsManager: InfractionsManager = new InfractionsManager();

export default class extends Command {
	constructor(client: BulbBotClient, name: string) {
		super(client, {
			name,
			description: "Unbans multiple people from a guild",
			category: "Moderation",
			aliases: ["munban"],
			usage: "<user> <user2>... [reason]",
			examples: ["multiunban 123456789012345678 123456789012345678 nice user", "multiunban @Wumpus#0000 @Nelly##0000 nice user"],
			argList: ["user:User"],
			minArgs: 2,
			maxArgs: -1,
			clearance: 50,
			userPerms: ["BAN_MEMBERS"],
			clientPerms: ["BAN_MEMBERS"],
		});
	}

	public async run(context: CommandContext, args: string[]): Promise<void | Message> {
		const potentialTargets: RegExpMatchArray = <RegExpMatchArray>args.slice(0).join(" ").match(UserMentionAndID);
		let validTargets: User[] = [];
		let invalidTargets: number = 0;
		let fullList: string = "";
		let reason: string = args.slice(potentialTargets?.length).join(" ").replace(UserMentionAndID, "");

		if (reason === "") reason = await this.client.bulbutils.translate("global_no_reason", context.guild?.id, {});

		for (const potentialTarget of potentialTargets) {
			const t = potentialTarget.replace(NonDigits, "");
			let target;
			if (!t.length) continue;

			try {
				target = await this.client.users.fetch(t);
			} catch (error) {
				invalidTargets++;
				continue;
			}

			validTargets = [...validTargets, target];
		}

		if (validTargets.length === 1) {
			await context.channel.send(
				await this.client.bulbutils.translate("action_multi_less_than_2", context.guild?.id, {
					action: await this.client.bulbutils.translate("action_multi_types.unban", context.guild?.id, {}),
				}),
			);
			return this.client.commands.get("unban")!.run(context, [validTargets[0].id, ...reason.split(" ")]);
		}

		await context.channel.send(await this.client.bulbutils.translate("global_loading", context.guild?.id, {})).then(msg => {
			setTimeout(async () => {
				if (validTargets.length)
					await msg.edit(
						await this.client.bulbutils.translate("action_success_multi", context.guild?.id, {
							action: await this.client.bulbutils.translate("mod_action_types.unban", context.guild?.id, {}),
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
			}, (args.length - 0.5) * massCommandSleep);
		});

		for (const target of validTargets) {
			await this.client.bulbutils.sleep(massCommandSleep);

			await context.guild?.bans.fetch();
			if (!context.guild?.bans.cache.get(target.id)) {
				invalidTargets++;
				continue;
			};

			const infID = await infractionsManager.unban(
				this.client,
				<Guild>context.guild,
				BanType.MANUAL,
				target,
				<GuildMember>context.member,
				await this.client.bulbutils.translate("global_mod_action_log", context.guild?.id, {
					action: await this.client.bulbutils.translate("mod_action_types.unban", context.guild?.id, {}),
					moderator: context.author,
					target: target,
					reason,
				}),
				reason,
			);

			fullList += ` **${target.tag}** \`\`(${target.id})\`\` \`\`[#${infID}]\`\``;
		}
	}
}
