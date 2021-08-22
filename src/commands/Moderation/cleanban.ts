import Command from "../../structures/Command";
import { Guild, GuildMember, Message, Snowflake } from "discord.js";
import { NonDigits } from "../../utils/Regex";
import InfractionsManager from "../../utils/managers/InfractionsManager";
import { BanType } from "../../utils/types/BanType";
import BulbBotClient from "../../structures/BulbBotClient";

const infractionsManager: InfractionsManager = new InfractionsManager();

export default class extends Command {
	constructor(client: BulbBotClient, name: string) {
		super(client, {
			name,
			description: "Bans a user and removes all their messages from the guild",
			category: "Moderation",
			usage: "<member> [reason]",
			examples: ["cleanban 123456789012345678", "softban 123456789012345678 rude user", "softban @Wumpus#0000 rude user"],
			argList: ["member:Member"],
			minArgs: 1,
			maxArgs: -1,
			clearance: 50,
			userPerms: ["BAN_MEMBERS"],
			clientPerms: ["BAN_MEMBERS"],
		});
	}

	async run(message: Message, args: string[]): Promise<void> {
		const targetID: Snowflake = args[0].replace(NonDigits, "");
		const target: GuildMember | null = targetID ? <GuildMember>await message.guild?.members.fetch(targetID).catch(() => null) : null;
		let reason: string = args.slice(1).join(" ");
		let infID: number;

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
		if (await this.client.bulbutils.resolveUserHandle(message, this.client.bulbutils.checkUser(message, target), target.user)) return;

		const banList = await message.guild?.bans.fetch();
		const bannedUser = banList?.find(user => user.user.id === targetID);

		if (!reason) reason = await this.client.bulbutils.translate("global_no_reason", message.guild?.id, {});

		if (bannedUser) {
			await message.channel.send(
				await this.client.bulbutils.translate("already_banned", message.guild?.id, {
					target,
					reason: bannedUser.reason,
				}),
			);
			return;
		}

		infID = await infractionsManager.ban(
			this.client,
			<Guild>message.guild,
			BanType.CLEAN,
			target.user,
			<GuildMember>message.member,
			await this.client.bulbutils.translate("global_mod_action_log", message.guild?.id, {
				action: await this.client.bulbutils.translate("mod_action_types.ban", message.guild?.id, {}),
				moderator: message.author,
				target,
				reason,
			}),
			reason,
		);

		await message.channel.send(
			await this.client.bulbutils.translate("action_success", message.guild?.id, {
				action: await this.client.bulbutils.translate("mod_action_types.ban", message.guild?.id, {}),
				target: target.user,
				reason,
				infraction_id: infID,
			}),
		);
	}
}
