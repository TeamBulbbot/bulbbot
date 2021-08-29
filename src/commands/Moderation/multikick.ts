import Command from "../../structures/Command";
import CommandContext from "../../structures/CommandContext";
import { GuildMember, Message, Snowflake } from "discord.js";
import { NonDigits, UserMentionAndID } from "../../utils/Regex";
import { massCommandSleep } from "../../Config";
import InfractionsManager from "../../utils/managers/InfractionsManager";
import BulbBotClient from "../../structures/BulbBotClient";

const infractionsManager: InfractionsManager = new InfractionsManager();

export default class extends Command {
	constructor(client: BulbBotClient, name: string) {
		super(client, {
			name,
			description: "Kicks multiple people from a guild",
			category: "Moderation",
			aliases: ["mkick"],
			usage: "<member> <member2>.... [reason]",
			examples: ["multikick 123456789012345678 123456789012345678 rude user", "multikick @Wumpus#0000 @Nelly##0000 rude user"],
			argList: ["member:Member"],
			minArgs: 1,
			maxArgs: -1,
			clearance: 50,
			userPerms: ["KICK_MEMBERS"],
			clientPerms: ["KICK_MEMBERS"],
		});
	}

	public async run(context: CommandContext, args: string[]): Promise<void | Message> {
		const potentialTargets: RegExpMatchArray = <RegExpMatchArray>args.slice(0).join(" ").match(UserMentionAndID);
		let validTargets: GuildMember[] = [];
		let invalidTargets: number = 0;
		let fullList: string = "";
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
					action: await this.client.bulbutils.translate("action_multi_types.kick", context.guild?.id, {}),
				}),
			);
			return this.client.commands.get("kick")!.run(context, [validTargets[0].id, ...reason.split(" ")]);
		}

		await context.channel.send(await this.client.bulbutils.translate("global_loading", context.guild?.id, {})).then(msg => {
			setTimeout(async () => {
				if (validTargets.length)
					await msg.edit(
						await this.client.bulbutils.translate("action_success_multi", context.guild?.id, {
							action: await this.client.bulbutils.translate("mod_action_types.kick", context.guild?.id, {}),
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

			const infID = await infractionsManager.kick(
				this.client,
				<Snowflake>context.guild?.id,
				target,
				<GuildMember>context.member,
				await this.client.bulbutils.translate("global_mod_action_log", context.guild?.id, {
					action: await this.client.bulbutils.translate("mod_action_types.kick", context.guild?.id, {}),
					moderator: context.author,
					target: target.user,
					reason,
				}),
				reason,
			);

			fullList += ` **${target.user.tag}** \`\`(${target.user.id})\`\` \`\`[#${infID}]\`\``;
		}
	}
}
