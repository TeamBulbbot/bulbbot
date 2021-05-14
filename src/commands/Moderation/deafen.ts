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
			usage: "!deafen <user> [reason]",
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

		if (!reason) reason = await this.client.bulbutils.translate("global_no_reason", message.guild?.id);
		if (!target) return message.channel.send(await this.client.bulbutils.translate("global_user_not_found", message.guild?.id));
		if (await this.client.bulbutils.resolveUserHandle(message, await this.client.bulbutils.checkUser(message, target), target.user)) return;
		if (!target.voice.channel) return message.channel.send(await this.client.bulbutils.translate("global_not_in_voice", message.guild?.id));
		if (target.voice.serverDeaf) return message.channel.send(await this.client.bulbutils.translate("deafen_already_deaf", message.guild?.id));

		infID = await infractionsManager.deafen(
			this.client,
			<Guild>message.guild,
			target,
			<GuildMember>message.member,
			await this.client.bulbutils.translate("global_mod_action_log", message.guild?.id, {
				action: "Deafened",
				moderator_tag: message.author.tag,
				moderator_id: message.author.id,
				target_tag: target.user.tag,
				target_id: target.user.id,
				reason,
			}),
			reason,
		);

		return message.channel.send(
			await this.client.bulbutils.translate("deafen_success", message.guild?.id, {
				target_tag: target.user.tag,
				target_id: target.user.id,
				reason,
				infractionId: infID,
			}),
		);
	}
}
