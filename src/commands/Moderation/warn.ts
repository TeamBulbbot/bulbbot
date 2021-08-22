import Command from "../../structures/Command";
import { GuildMember, Message, Snowflake } from "discord.js";
import InfractionsManager from "../../utils/managers/InfractionsManager";
import { NonDigits } from "../../utils/Regex";
import BulbBotClient from "../../structures/BulbBotClient";

const infractionsManager: InfractionsManager = new InfractionsManager();

export default class extends Command {
	constructor(client: BulbBotClient, name: string) {
		super(client, {
			name,
			description: "Warns the selected guild member",
			category: "Moderation",
			usage: "<member> [reason]",
			examples: ["warn 123456789012345678", "warn 123456789012345678 rude user", "warn @Wumpus#0000 rude user"],
			argList: ["member:Member"],
			minArgs: 1,
			maxArgs: -1,
			clearance: 50,
			userPerms: ["MANAGE_ROLES"],
		});
	}

	async run(message: Message, args: string[]): Promise<void> {
		//Variable declarations
		const targetID: Snowflake = args[0].replace(NonDigits, "");
		const target: GuildMember | null = targetID ? <GuildMember>await message.guild?.members.fetch(targetID).catch(() => null) : null;
		let reason: string = args.slice(1).join(" ");
		let infID: number;

		//Checks if reason or target are null and if the target is actionable
		if (!target) {
			await message.channel.send({
				content: await this.client.bulbutils.translate("global_not_found", message.guild?.id, {
					type: await this.client.bulbutils.translate("global_not_found_types.member", message.guild?.id, {}),
					arg_expected: "member:Member",
					arg_provided: args[0],
					usage: this.usage,
				}),
				allowedMentions: {
					parse: ["everyone", "roles", "users"],
				},
			});
			return;
		}
		if (!reason) reason = await this.client.bulbutils.translate("global_no_reason", message.guild?.id, {});

		if (await this.client.bulbutils.resolveUserHandle(message, this.client.bulbutils.checkUser(message, target), target.user)) return;

		//Executes the action
		infID = await infractionsManager.warn(
			this.client,
			<string>message.guild?.id,
			target,
			<GuildMember>message.member,
			await this.client.bulbutils.translate("global_mod_action_log", message.guild?.id, {
				action: await this.client.bulbutils.translate("mod_action_types.warn", message.guild?.id, {}),
				moderator: message.author,
				target: target.user,
				reason,
			}),
			reason,
		);

		//Sends the respond message
		await message.channel.send(
			await this.client.bulbutils.translate("action_success", message.guild?.id, {
				action: await this.client.bulbutils.translate("mod_action_types.warn", message.guild?.id, {}),
				target: target.user,
				reason,
				infraction_id: infID,
			}),
		);
	}
}
