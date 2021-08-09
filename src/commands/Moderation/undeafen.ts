import Command from "../../structures/Command";
import { Guild, GuildMember, Message, Snowflake } from "discord.js";
import { NonDigits } from "../../utils/Regex";
import InfractionsManager from "../../utils/managers/InfractionsManager";
import BulbBotClient from "../../structures/BulbBotClient";

const infractionsManager: InfractionsManager = new InfractionsManager();

export default class extends Command {
	constructor(client: BulbBotClient, name: string) {
		super(client, {
			name,
			description: "Undeafens a member from a Voice Channel they're connected to",
			category: "Moderation",
			usage: "<user> [reason]",
			examples: ["undeafen 123456789012345678", "undeafen 123456789012345678 nice user", "undeafen @Wumpus#0000 nice user"],
			argList: ["member:Member"],
			minArgs: 1,
			maxArgs: -1,
			clearance: 50,
			userPerms: ["DEAFEN_MEMBERS"],
			clientPerms: ["DEAFEN_MEMBERS"],
		});
	}

	public async run(message: Message, args: string[]): Promise<void | Message> {
		const targetID: Snowflake = args[0].replace(NonDigits, "");
		let target: GuildMember = <GuildMember>message.guild?.member(targetID);
		let reason: string = args.slice(1).join(" ");
		let infID: number;

		if (!reason) reason = await this.client.bulbutils.translateNew("global_no_reason", message.guild?.id, {});
		if (!target)
			return message.channel.send(
				await this.client.bulbutils.translateNew("global_not_found", message.guild?.id, {
					type: await this.client.bulbutils.translateNew("global_not_found_types.member", message.guild?.id, {}),
					arg_expected: "member:Member",
					arg_provided: args[0],
					usage: this.usage,
				}),
			);
		if (!target.voice.channel) return message.channel.send(await this.client.bulbutils.translateNew("global_not_in_voice", message.guild?.id, {}));
		if (!target.voice.serverDeaf) return message.channel.send(await this.client.bulbutils.translateNew("undeafen_not_deaf", message.guild?.id, {}));

		infID = await infractionsManager.undeafen(
			this.client,
			<Guild>message.guild,
			target,
			<GuildMember>message.member,
			await this.client.bulbutils.translateNew("global_mod_action_log", message.guild?.id, {
				action: await this.client.bulbutils.translateNew("mod_action_types.undeafen", message.guild?.id, {}),
				moderator: message.author,
				target: target.user,
				reason,
			}),
			reason,
		);

		return message.channel.send(
			await this.client.bulbutils.translateNew("action_success", message.guild?.id, {
				action: await this.client.bulbutils.translateNew("undeafen_not_deaf", message.guild?.id, {}),
				target: target.user,
				reason,
				infractionId: infID,
			}),
		);
	}
}
