import Command from "../../structures/Command";
import CommandContext from "../../structures/CommandContext";
import { GuildMember, Snowflake } from "discord.js";
import InfractionsManager from "../../utils/managers/InfractionsManager";
import { NonDigits } from "../../utils/Regex";
import BulbBotClient from "../../structures/BulbBotClient";

const infractionsManager: InfractionsManager = new InfractionsManager();

export default class extends Command {
	constructor(client: BulbBotClient, name: string) {
		super(client, {
			name,
			description: "Warns the selected server member",
			category: "Moderation",
			usage: "<member> [reason]",
			examples: ["warn 123456789012345678", "warn 123456789012345678 rude user", "warn @Wumpus#0000 rude user"],
			argList: ["member:Member", "reason:String"],
			minArgs: 1,
			maxArgs: -1,
			clearance: 50,
			userPerms: ["MANAGE_ROLES"],
		});
	}

	async run(context: CommandContext, args: string[]): Promise<void> {
		//Variable declarations
		const targetID: Snowflake = args[0].replace(NonDigits, "");
		const target: GuildMember | undefined = await this.client.bulbfetch.getGuildMember(context.guild?.members, targetID);
		let reason: string = args.slice(1).join(" ");

		//Checks if reason or target are null and if the target is actionable
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
		if (!reason) reason = await this.client.bulbutils.translate("global_no_reason", context.guild?.id, {});

		if (await this.client.bulbutils.resolveUserHandle(context, this.client.bulbutils.checkUser(context, target), target.user)) return;

		//Executes the action
		const infID = await infractionsManager.warn(
			this.client,
			<string>context.guild?.id,
			target.user,
			<GuildMember>context.member,
			await this.client.bulbutils.translate("global_mod_action_log", context.guild?.id, {
				action: await this.client.bulbutils.translate("mod_action_types.warn", context.guild?.id, {}),
				moderator: context.author,
				target: target.user,
				reason,
			}),
			reason,
		);

		//Sends the respond context
		await context.channel.send(
			await this.client.bulbutils.translate("action_success", context.guild?.id, {
				action: await this.client.bulbutils.translate("mod_action_types.warn", context.guild?.id, {}),
				target: target.user,
				reason,
				infraction_id: infID,
			}),
		);
	}
}
