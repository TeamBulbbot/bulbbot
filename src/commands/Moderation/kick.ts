import Command from "../../structures/Command";
import { GuildMember, Message, Snowflake } from "discord.js";
import { NonDigits } from "../../utils/Regex";
import InfractionsManager from "../../utils/managers/InfractionsManager";
import BulbBotClient from "../../structures/BulbBotClient";

const infractionsManager: InfractionsManager = new InfractionsManager();

export default class extends Command {
	constructor(client: BulbBotClient, name: string) {
		super(client, {
			name,
			description: "Kicks a user from the guild",
			category: "Moderation",
			usage: "<member> [reason]",
			examples: ["kick 123456789012345678", "kick 123456789012345678 rude user", "kick @Wumpus#0000 rude user"],
			argList: ["member:Member"],
			minArgs: 1,
			maxArgs: -1,
			clearance: 50,
			userPerms: ["KICK_MEMBERS"],
			clientPerms: ["KICK_MEMBERS"],
		});
	}

	async run(message: Message, args: string[]): Promise<void> {
		//Variable declarations
		const targetID: Snowflake = args[0].replace(NonDigits, "");
		let target: GuildMember = <GuildMember>message.guild?.member(targetID);
		let reason: string = args.slice(1).join(" ");
		let infID: number;

		//Checks if the reason or target is null and if the target is actionable
		if (!reason) reason = await this.client.bulbutils.translateNew("global_no_reason", message.guild?.id, {});
		if (!target) {
			await message.channel.send(
				await this.client.bulbutils.translateNew("global_not_found", message.guild?.id, {
					type: await this.client.bulbutils.translateNew("global_not_found_types.member", message.guild?.id, {}),
					arg_expected: "member:Member",
					arg_provided: args[0],
					usage: this.usage,
				}),
			);
			return;
		}
		if (await this.client.bulbutils.resolveUserHandle(message, this.client.bulbutils.checkUser(message, target), target.user)) return;

		//Executes the action
		infID = await infractionsManager.kick(
			this.client,
			<string>message.guild?.id,
			target,
			<GuildMember>message.member,
			await this.client.bulbutils.translateNew("global_mod_action_log", message.guild?.id, {
				action: await this.client.bulbutils.translateNew("mod_action_types.kick", message.guild?.id, {}),
				moderator: message.author,
				target,
				reason,
			}),
			reason,
		);

		//Sends the respond message
		await message.channel.send(
			await this.client.bulbutils.translateNew("action_success", message.guild?.id, {
				action: await this.client.bulbutils.translateNew("mod_action_types.kick", message.guild?.id, {}),
				target: target.user,
				reason,
				infraction_id: infID,
			}),
		);
	}
}
