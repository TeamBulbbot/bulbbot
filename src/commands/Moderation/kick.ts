import Command from "../../structures/Command";
import CommandContext from "../../structures/CommandContext";
import { GuildMember, Snowflake } from "discord.js";
import { NonDigits } from "../../utils/Regex";
import InfractionsManager from "../../utils/managers/InfractionsManager";
import BulbBotClient from "../../structures/BulbBotClient";

const infractionsManager: InfractionsManager = new InfractionsManager();

export default class extends Command {
	constructor(client: BulbBotClient, name: string) {
		super(client, {
			name,
			description: "Kicks a user from the server",
			category: "Moderation",
			usage: "<member> [reason]",
			examples: ["kick 123456789012345678", "kick 123456789012345678 rude user", "kick @Wumpus#0000 rude user"],
			argList: ["member:Member", "reason:String"],
			minArgs: 1,
			maxArgs: -1,
			clearance: 50,
			userPerms: ["KICK_MEMBERS"],
			clientPerms: ["KICK_MEMBERS"],
		});
	}

	async run(context: CommandContext, args: string[]): Promise<void> {
		//Variable declarations
		const targetID: Snowflake = args[0].replace(NonDigits, "");
		const target: GuildMember | undefined = await this.client.bulbfetch.getGuildMember(context.guild?.members, targetID);
		let reason: string = args.slice(1).join(" ");

		//Checks if the reason or target is null and if the target is actionable
		if (!reason) reason = await this.client.bulbutils.translate("global_no_reason", context.guild?.id, {});
		if (!target) {
			await context.channel.send(
				await this.client.bulbutils.translate("global_not_found", context.guild?.id, {
					type: await this.client.bulbutils.translate("global_not_found_types.member", context.guild?.id, {}),
					arg_expected: "member:Member",
					arg_provided: args[0],
					usage: this.usage,
				}),
			);
			return;
		}
		if (await this.client.bulbutils.resolveUserHandle(context, this.client.bulbutils.checkUser(context, target), target.user)) return;
		if (!context.guild?.id || !context.member) return;

		//Executes the action
		const infID = await infractionsManager.kick(
			this.client,
			context.guild.id,
			target,
			context.member,
			await this.client.bulbutils.translate("global_mod_action_log", context.guild.id, {
				action: await this.client.bulbutils.translate("mod_action_types.kick", context.guild.id, {}),
				moderator: context.author,
				target: target.user,
				reason,
			}),
			reason,
		);

		if (infID === null) return;

		//Sends the respond context
		await context.channel.send(
			await this.client.bulbutils.translate("action_success", context.guild.id, {
				action: await this.client.bulbutils.translate("mod_action_types.kick", context.guild.id, {}),
				target: target.user,
				reason,
				infraction_id: infID,
			}),
		);
	}
}
