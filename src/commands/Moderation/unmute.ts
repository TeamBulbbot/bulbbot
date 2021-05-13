import Command from "../../structures/Command";
import { Guild, GuildMember, Message, Snowflake } from "discord.js";
import { NonDigits } from "../../utils/Regex";
import DatabaseManager from "../../utils/managers/DatabaseManager";
import InfractionsManager from "../../utils/managers/InfractionsManager";
import * as Emotes from "../../emotes.json";
import { MuteType } from "../../utils/types/MuteType";

const databaseManager: DatabaseManager = new DatabaseManager();
const infractionsManager: InfractionsManager = new InfractionsManager();

export default class extends Command {
	constructor(...args) {
		// @ts-ignore
		super(...args, {
			description: "Unutes the selected user",
			category: "Moderation",
			usage: "!unmute <member> [reason]",
			examples: ["unmute 123456789012345678", "unmute 123456789012345678 nice user", "unmute @Wumpus#0000 nice user"],
			argList: ["member:Member"],
			minArgs: 1,
			maxArgs: -1,
			clearance: 50,
		});
	}

	public async run(message: Message, args: string[]): Promise<void | Message> {
		const targetID: Snowflake = args[0].replace(NonDigits, "");
		const target: GuildMember = <GuildMember>message.guild?.member(targetID);
		const muteRole: Snowflake = <Snowflake>await databaseManager.getMuteRole(<Snowflake>message.guild?.id);
		let reason: string = args.slice(1).join(" ");
		let infID: number;

		if (!reason) reason = await this.client.bulbutils.translate("global_no_reason", message.guild?.id);
		if (!muteRole) return message.channel.send(await this.client.bulbutils.translate("mute_muterole_not_found", message.guild?.id));
		if (!target) return message.channel.send(await this.client.bulbutils.translate("global_user_not_found", message.guild?.id));
		if (!target.roles.cache.find(role => role.id === muteRole)) return message.channel.send(await this.client.bulbutils.translate("mute_not_muted", message.guild?.id));

		const latestMute: object = <object>await infractionsManager.getLatestMute(<Snowflake>message.guild?.id, target.user.id);
		let confirmMsg: Message;

		if (latestMute) {
			infID = await infractionsManager.unmute(
				this.client,
				<Guild>message.guild,
				MuteType.MANUAL,
				target,
				message.author,
				await this.client.bulbutils.translate("global_mod_action_log", message.guild?.id, {
					action: "Unmuted",
					moderator_tag: message.author.tag,
					moderator_id: message.author.id,
					target_tag: target.user.tag,
					target_id: target.user.id,
					reason: reason,
				}),
				reason,
				muteRole,
			);

			const latestMute: object = <object>await infractionsManager.getLatestMute(<Snowflake>message.guild?.id, target.user.id);
			await infractionsManager.setActive(<Snowflake>message.guild?.id, latestMute["id"], false);

			await message.channel.send(
				await this.client.bulbutils.translate("unmute_success", message.guild?.id, {
					target_tag: target.user.tag,
					target_id: target.user.id,
					reason,
					infractionId: infID,
				}),
			);
		} else {
			await message.channel
				.send(
					await this.client.bulbutils.translate("mute_confirm", message.guild?.id, {
						user_tag: target.user.tag,
						user_id: target.user.id,
					}),
				)
				.then(msg => {
					confirmMsg = msg;
					msg.react(Emotes.other.SUCCESS);
					msg.react(Emotes.other.FAIL);

					const filter = (reaction, user) => {
						return user.id === message.author.id;
					};

					msg
						.awaitReactions(filter, { max: 1, time: 30000, errors: ["time"] })
						.then(async collected => {
							const reaction = collected.first();

							if (reaction?.emoji.id === Emotes.other.SUCCESS.replace(NonDigits, "")) {
								await msg.delete();
								await target.roles.remove(muteRole);
								await message.channel.send(
									await this.client.bulbutils.translate("unmute_success_special", message.guild?.id, {
										target_tag: target.user.tag,
										target_id: target.user.id,
										reason,
									}),
								);
							} else {
								await msg.delete();
								await message.channel.send(await this.client.bulbutils.translate("global_execution_cancel", message.guild?.id));
							}
						})
						.catch(async () => {
							await confirmMsg.delete();
							await message.channel.send(await this.client.bulbutils.translate("global_execution_cancel", message.guild?.id));
						});
				});
		}
	}
}
