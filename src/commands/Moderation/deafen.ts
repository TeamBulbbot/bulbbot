import Command from "../../structures/Command";
import { Guild, GuildMember, Message, Snowflake } from "discord.js";
import { NonDigits } from "../../utils/Regex";
import InfractionsManager from "../../utils/managers/InfractionsManager";

const infractionsManager: InfractionsManager = new InfractionsManager();

export default class extends Command {
	constructor(...args) {
		// @ts-ignore
		super(...args, {
			description: "Deafens a member from a Voice Channel they're connected to",
			category: "Moderation",
			usage: "<user> [reason]",
			examples: ["deafen 123456789012345678", "deafen 123456789012345678 rude user", "deafen @Wumos#0000 rude user"],
			argList: ["user:User"],
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
					arg_provided: args[0],
					arg_expected: "member:Member",
					usage: this.usage,
				}),
			);
		if (await this.client.bulbutils.resolveUserHandle(message, await this.client.bulbutils.checkUser(message, target), target.user)) return;
		if (!target.voice.channel) return message.channel.send(await this.client.bulbutils.translateNew("global_not_in_voice", message.guild?.id, { target: target.user }));
		if (target.voice.serverDeaf) return message.channel.send(await this.client.bulbutils.translateNew("deafen_already_deaf", message.guild?.id, { target: target.user }));

		infID = await infractionsManager.deafen(
			this.client,
			<Guild>message.guild,
			target,
			<GuildMember>message.member,
			await this.client.bulbutils.translateNew("global_mod_action_log", message.guild?.id, {
				action: await this.client.bulbutils.translateNew("mod_action_types.deafen", message.guild?.id, {}),
				moderator: message.author,
				target: target.user,
				reason,
			}),
			reason,
		);

		await message.channel.send(
			await this.client.bulbutils.translateNew("action_success", message.guild?.id, {
				action: await this.client.bulbutils.translateNew("mod_action_types.deafen", message.guild?.id, {}),
				target: target.user,
				reason,
				infraction_id: infID,
			}),
		);
	}
}
