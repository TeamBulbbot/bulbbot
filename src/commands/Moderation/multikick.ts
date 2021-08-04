import Command from "../../structures/Command";
import { GuildMember, Message, Snowflake } from "discord.js";
import { NonDigits, UserMentionAndID } from "../../utils/Regex";
import { massCommandSleep } from "../../Config";
import InfractionsManager from "../../utils/managers/InfractionsManager";

const infractionsManager: InfractionsManager = new InfractionsManager();

export default class extends Command {
	constructor(...args) {
		// @ts-ignore
		super(...args, {
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

	public async run(message: Message, args: string[]): Promise<void | Message> {
		const targets: RegExpMatchArray = <RegExpMatchArray>args.slice(0).join(" ").match(UserMentionAndID);
		if (targets === null)
			return message.channel.send(
				await this.client.bulbutils.translateNew("global_not_found", message.guild?.id, {
					type: await this.client.bulbutils.translateNew("global_not_found_types.member", message.guild?.id, {}),
					arg_expected: "member:Member",
					arg_provided: args[0],
					usage: this.usage,
				}),
			);
		let reason: string = args.slice(targets.length).join(" ").replace(UserMentionAndID, "");

		if (reason === "") reason = await this.client.bulbutils.translateNew("global_no_reason", message.guild?.id, {});
		let fullList: string = "";

		if (targets!!.length <= 1) {
			await message.channel.send(
				await this.client.bulbutils.translateNew("action_multi_less_than_2", message.guild?.id, {
					action: await this.client.bulbutils.translateNew("action_multi_types.kick", message.guild?.id, {}),
				}),
			);
			return await this.client.commands.get("kick")!.run(message, args);
		}

		message.channel.send(await this.client.bulbutils.translateNew("global_loading", message.guild?.id, {})).then(msg => {
			msg.delete({ timeout: (args.length - 0.5) * massCommandSleep });
		});

		for (let i = 0; i < targets.length; i++) {
			if (targets[i] === undefined) continue;
			await this.client.bulbutils.sleep(massCommandSleep);

			const t: string = targets[i].replace(NonDigits, "");
			const target: GuildMember = <GuildMember>await message.guild?.member(t);
			let infID: number;

			if (!target) {
				await message.channel.send(
					await this.client.bulbutils.translateNew("global_not_found", message.guild?.id, {
						type: await this.client.bulbutils.translateNew("global_not_found_types.member", message.guild?.id, {}),
						arg_provided: t,
						arg_expected: "member:Member",
						usage: this.usage,
					}),
				);
				continue;
			}
			if (await this.client.bulbutils.resolveUserHandle(message, await this.client.bulbutils.checkUser(message, target), target.user)) return;

			infID = await infractionsManager.kick(
				this.client,
				<Snowflake>message.guild?.id,
				target,
				<GuildMember>message.member,
				await this.client.bulbutils.translateNew("global_mod_action_log", message.guild?.id, {
					action: await this.client.bulbutils.translateNew("mod_action_types.kick", message.guild?.id, {}),
					moderator: message.author,
					target: target.user,
					reason,
				}),
				reason,
			);

			fullList += ` **${target.user.tag}** \`\`(${target.user.id})\`\` \`\`[#${infID}]\`\``;
		}

		return message.channel.send(
			await this.client.bulbutils.translateNew("action_success_multi", message.guild?.id, {
				action: await this.client.bulbutils.translateNew("mod_action_types.kick", message.guild?.id, {}),
				full_list: fullList,
				reason,
			}),
		);
	}
}
