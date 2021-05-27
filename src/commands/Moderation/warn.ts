import Command from "../../structures/Command";
import { GuildMember, Message, Snowflake } from "discord.js";
import InfractionsManager from "../../utils/managers/InfractionsManager";
import { NonDigits } from "../../utils/Regex";

const infractionsManager: InfractionsManager = new InfractionsManager();

export default class extends Command {
	constructor(...args) {
		// @ts-ignore
		super(...args, {
			description: "Warns the selected guild member",
			category: "Moderation",
			usage: "!warn <member> [reason]",
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
		const target: GuildMember = <GuildMember>message.guild?.member(targetID);
		let reason: string = args.slice(1).join(" ");
		let infID: number;

		//Checks if reason or target are null and if the target is actionable
		if (!target) {
			await message.channel.send(
				await this.client.bulbutils.translate("global_user_not_found", message.guild?.id, {
					arg_expected: "member:Member",
					arg_provided: args[0],
					usage: this.usage,
				}),
			);
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
				action: "Warned",
				moderator_tag: message.author.tag,
				moderator_id: message.author.id,
				target_tag: target.user.tag,
				target_id: target.user.id,
				reason,
			}),
			reason,
		);

		//Sends the respond message
		await message.channel.send(
			await this.client.bulbutils.translate("warn_success", message.guild?.id, {
				user_name: target.user.username,
				user_discriminator: target.user.discriminator,
				user_id: target.user.id,
				reason: reason,
				infractionId: infID,
			}),
		);
	}
}