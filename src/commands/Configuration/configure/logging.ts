import SubCommand from "../../../structures/SubCommand";
import { GuildChannel, GuildMember, Message, Snowflake, TextChannel } from "discord.js";
import Command from "../../../structures/Command";
import DatabaseManager from "../../../utils/managers/DatabaseManager";
import { NonDigits } from "../../../utils/Regex";
import * as Emotes from "../../../emotes.json";

const databaseManager: DatabaseManager = new DatabaseManager();

export default class extends SubCommand {
	constructor(...args) {
		// @ts-ignore
		super(...args, {
			name: "logging",
			clearance: 75,
			minArgs: 2,
			maxArgs: 2,
			argList: ["part:string", "channel:Channel"],
			usage: "!configure logging <part> <channel>",
		});
	}

	public async run(message: Message, parent: Command, args: string[]): Promise<void | Message> {
		const part: string = args[1];
		const original: TextChannel = <TextChannel>message.guild?.channels.cache.get((await databaseManager.getLoggingConfig(<Snowflake>message.guild?.id))["modAction"]);
		let channel: string | null = args[2];
		let confirmMsg: Message;

		if (channel === "remove") channel = null;
		else {
			channel = channel.replace(NonDigits, "");
			const cTemp: GuildChannel = <GuildChannel>message.guild?.channels.cache.get(channel);
			if (cTemp === undefined) {
				return message.channel.send(
					await this.client.bulbutils.translateNew("global_not_found", message.guild?.id, {
						type: await this.client.bulbutils.translateNew("global_not_found_types.channel", message.guild?.id, {}),
						arg_expected: "channel:Channel",
						arg_provided: args[2],
						usage: this.usage,
					}),
				);
			}

			if (!cTemp.permissionsFor(<GuildMember>message.guild?.me)?.has(["SEND_MESSAGES", "VIEW_CHANNEL"])) {
				return await message.channel.send(await this.client.bulbutils.translateNew("config_logging_unable_to_send_messages", message.guild?.id, { channel: cTemp }));
			}
		}

		switch (part) {
			case "mod_actions":
			case "mod_logs":
			case "modlogs":
			case "modactions":
				await databaseManager.setModAction(<Snowflake>message.guild?.id, channel);
				break;
			case "automod":
			case "auto_mod":
				await databaseManager.setAutoMod(<Snowflake>message.guild?.id, channel);
				break;
			case "messagelogs":
			case "message_logs":
				await databaseManager.setMessage(<Snowflake>message.guild?.id, channel);
				break;
			case "rolelogs":
			case "role_logs":
				await databaseManager.setRole(<Snowflake>message.guild?.id, channel);
				break;
			case "memberlogs":
			case "member_logs":
				await databaseManager.setMember(<Snowflake>message.guild?.id, channel);
				break;
			case "channellogs":
			case "channel_logs":
				await databaseManager.setChannel(<Snowflake>message.guild?.id, channel);
				break;
			case "invitelogs":
			case "invite_logs":
				await databaseManager.setInvite(<Snowflake>message.guild?.id, channel);
				break;
			case "joinleave":
			case "join_leave":
				await databaseManager.setJoinLeave(<Snowflake>message.guild?.id, channel);
				break;
			case "other":
				await databaseManager.setOther(<Snowflake>message.guild?.id, channel);
				break;
			case "all":
				const msg = await message.channel.send(await this.client.bulbutils.translateNew("config_logging_all_confirm", message.guild?.id, { channel }));

				confirmMsg = msg;
				await msg.react(Emotes.other.SUCCESS);
				await this.client.bulbutils.sleep(250);
				await msg.react(Emotes.other.FAIL);

				const filter = (reaction, user) => {
					return user.id === message.author.id;
				};

				let collected;
				try {
					collected = await msg.awaitReactions(filter, { max: 1, time: 30000, errors: ["time"] });
				} catch (err) {
					await confirmMsg.delete();
					await message.channel.send(await this.client.bulbutils.translateNew("global_execution_cancel", message.guild?.id, {}));
					return;
				}

				const reaction = collected.first();

				if (reaction?.emoji.id === Emotes.other.SUCCESS.replace(NonDigits, "")) {
					await databaseManager.setModAction(<Snowflake>message.guild?.id, channel);
					await databaseManager.setAutoMod(<Snowflake>message.guild?.id, channel);
					await databaseManager.setMessage(<Snowflake>message.guild?.id, channel);
					await databaseManager.setRole(<Snowflake>message.guild?.id, channel);
					await databaseManager.setMember(<Snowflake>message.guild?.id, channel);
					await databaseManager.setChannel(<Snowflake>message.guild?.id, channel);
					await databaseManager.setInvite(<Snowflake>message.guild?.id, channel);
					await databaseManager.setJoinLeave(<Snowflake>message.guild?.id, channel);
					await databaseManager.setOther(<Snowflake>message.guild?.id, channel);
					await msg.delete();
				} else {
					await msg.delete();
					await message.channel.send(await this.client.bulbutils.translateNew("global_execution_cancel", message.guild?.id, {}));
					return;
				}
				break;
			default:
				return await message.channel.send(
					await this.client.bulbutils.translateNew("event_message_args_missing_list", message.guild?.id, {
						argument: args[1].toLowerCase(),
						arg_expected: "part:string",
						argument_list: "`mute_role`, `mod_logs`, `automod`, `message_logs`, `role_logs`, `member_logs`, `channel_logs`, `invite_logs` ,`join_leave`, `other`, `all`",
					}),
				);
		}

		if (channel === null) {
			return await message.channel.send(
				await this.client.bulbutils.translateNew("config_logging_remove", message.guild?.id, {
					logging_type: part,
					channel: original,
				}),
			);
		} else {
			return await message.channel.send(
				await this.client.bulbutils.translateNew("config_logging_success", message.guild?.id, {
					logging_type: part,
					channel: message.guild?.channels.cache.get(channel),
				}),
			);
		}
	}
}
