import Command from "../../structures/Command";
import { Guild, GuildMember, Message } from "discord.js";
import { NonDigits, UserMentionAndID } from "../../utils/Regex";
import { massCommandSleep } from "../../Config";
import InfractionsManager from "../../utils/managers/InfractionsManager";
import BulbBotClient from "../../structures/BulbBotClient";
import { BanType } from "../../utils/types/BanType";

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

	public async run(message: Message, args: string[]): Promise<void | Message> {
		const targets: RegExpMatchArray = <RegExpMatchArray>args.slice(0).join(" ").match(UserMentionAndID);
		let reason: string = args.slice(targets.length).join(" ").replace(UserMentionAndID, "");

		if (reason === "") reason = await this.client.bulbutils.translate("global_no_reason", message.guild?.id, {});
		let fullList: string = "";

		if (targets!!.length <= 1) {
			await message.channel.send(
				await this.client.bulbutils.translate("action_multi_less_than_2", message.guild?.id, {
					action: await this.client.bulbutils.translate("action_multi_types.unban", message.guild?.id, {}),
				}),
			);
			return await this.client.commands.get("unban")!.run(message, args);
		}

		message.channel.send(await this.client.bulbutils.translate("global_loading", message.guild?.id, {})).then(msg => {
			setTimeout(() => msg.delete(), (args.length - 0.5) * massCommandSleep);
		});

		for (let i = 0; i < targets.length; i++) {
			if (targets[i] === undefined) continue;
			await this.client.bulbutils.sleep(massCommandSleep);

			let target;
			let infID: number;
			try {
				target = await this.client.users.fetch(targets[i].replace(NonDigits, ""));
			} catch (error) {
				await message.channel.send({
					content: await this.client.bulbutils.translate("global_not_found", message.guild?.id, {
						type: await this.client.bulbutils.translate("global_not_found_types.user", message.guild?.id, {}),
						arg_expected: "user:User",
						arg_provided: targets[i],
						usage: this.usage,
					}),
					allowedMentions: {
						parse: ["everyone", "roles", "users"],
					},
				});
			}

			infID = await infractionsManager.unban(
				this.client,
				<Guild>message.guild,
				BanType.MANUAL,
				target,
				<GuildMember>message.member,
				await this.client.bulbutils.translate("global_mod_action_log", message.guild?.id, {
					action: await this.client.bulbutils.translate("mod_action_types.unban", message.guild?.id, {}),
					moderator: message.author,
					target,
					reason,
				}),
				reason,
			);

			fullList += ` **${target.tag}** \`\`(${target.id})\`\` \`\`[#${infID}]\`\``;
		}

		return message.channel.send(
			await this.client.bulbutils.translate("action_success_multi", message.guild?.id, {
				action: await this.client.bulbutils.translate("mod_action_types.unban", message.guild?.id, {}),
				full_list: fullList,
				reason,
			}),
		);
	}
}
