import Command from "../../structures/Command";
import CommandContext from "../../structures/CommandContext";
import { Guild, GuildMember, Message, Snowflake } from "discord.js";
import { NonDigits } from "../../utils/Regex";
import InfractionsManager from "../../utils/managers/InfractionsManager";
import { MuteType } from "../../utils/types/MuteType";
import BulbBotClient from "../../structures/BulbBotClient";

const infractionsManager: InfractionsManager = new InfractionsManager();

export default class extends Command {
	constructor(client: BulbBotClient, name: string) {
		super(client, {
			name,
			description: "Unmutes the selected user",
			category: "Moderation",
			usage: "<member> [reason]",
			examples: ["unmute 123456789012345678", "unmute 123456789012345678 nice user", "unmute @Wumpus#0000 nice user"],
			argList: ["member:Member"],
			minArgs: 1,
			maxArgs: -1,
			clearance: 50,
			userPerms: ["MODERATE_MEMBERS"],
			clientPerms: ["MODERATE_MEMBERS"],
		});
	}

	public async run(context: CommandContext, args: string[]): Promise<void | Message> {
		const targetID: Snowflake = args[0].replace(NonDigits, "");
		const target: GuildMember | undefined = await this.client.bulbfetch.getGuildMember(context.guild?.members, targetID);
		let reason: string = args.slice(1).join(" ");
		let infID: number;

		if (!reason) reason = await this.client.bulbutils.translate("global_no_reason", context.guild?.id, {});
		if (!target)
			return context.channel.send(
				await this.client.bulbutils.translate("global_not_found", context.guild?.id, {
					type: await this.client.bulbutils.translate("global_not_found_types.member", context.guild?.id, {}),
					arg_provided: args[0],
					arg_expected: "member:Member",
					usage: this.usage,
				}),
			);

		if (await this.client.bulbutils.resolveUserHandle(context, this.client.bulbutils.checkUser(context, target), target.user)) return;
		if (target.communicationDisabledUntilTimestamp === null) return context.channel.send(await this.client.bulbutils.translate("mute_not_muted", context.guild?.id, { target: target.user }));

		infID = await infractionsManager.unmute(
			this.client,
			<Guild>context.guild,
			MuteType.MANUAL,
			target,
			context.author,
			await this.client.bulbutils.translate("global_mod_action_log", context.guild?.id, {
				action: await this.client.bulbutils.translate("mod_action_types.unmute", context.guild?.id, {}),
				moderator: context.author,
				target: target.user,
				reason: reason,
			}),
			reason,
		);

		await context.channel.send(
			await this.client.bulbutils.translate("action_success", context.guild?.id, {
				action: await this.client.bulbutils.translate("mod_action_types.unmute", context.guild?.id, {}),
				target: target.user,
				reason,
				infraction_id: infID,
			}),
		);
	}
}
