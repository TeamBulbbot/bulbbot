import Command from "../../../structures/Command";
import SubCommand from "../../../structures/SubCommand";
import CommandContext from "../../../structures/CommandContext";
import { ButtonInteraction, GuildChannel, GuildMember, Message, MessageActionRow, MessageButton, Snowflake } from "discord.js";
import DatabaseManager from "../../../utils/managers/DatabaseManager";
import { NonDigits } from "../../../utils/Regex";
import BulbBotClient from "../../../structures/BulbBotClient";

const databaseManager: DatabaseManager = new DatabaseManager();

export default class extends SubCommand {
	constructor(client: BulbBotClient, parent: Command) {
		super(client, parent, {
			name: "logging",
			aliases: ["log", "logs"],
			clearance: 75,
			minArgs: 2,
			maxArgs: 2,
			argList: ["part:string", "channel:Channel"],
			usage: "<part> <channel>",
		});
	}

	public async run(context: CommandContext, args: string[]): Promise<void | Message> {
		const part: string = args[0];
		const original: string = (await databaseManager.getLoggingConfig(<Snowflake>context.guild?.id))["modAction"];
		let channel: string | null = args[1];
		let confirmMsg: Message;

		if (channel === "remove" || channel === "disable") channel = null;
		else {
			channel = channel.replace(NonDigits, "");
			const cTemp: GuildChannel = <GuildChannel>context.guild?.channels.cache.get(channel);
			if (cTemp === undefined) {
				return context.channel.send(
					await this.client.bulbutils.translate("global_not_found", context.guild?.id, {
						type: await this.client.bulbutils.translate("global_not_found_types.channel", context.guild?.id, {}),
						arg_expected: "channel:Channel",
						arg_provided: args[1],
						usage: this.usage,
					}),
				);
			}

			if (!cTemp.permissionsFor(<GuildMember>context.guild?.me)?.has(["SEND_MESSAGES", "VIEW_CHANNEL"])) {
				return await context.channel.send(await this.client.bulbutils.translate("config_logging_unable_to_send_messages", context.guild?.id, { channel: cTemp }));
			}
		}

		switch (part) {
			case "mod_actions":
			case "mod_logs":
			case "modlogs":
			case "modactions":
				await databaseManager.setModAction(<Snowflake>context.guild?.id, channel);
				break;
			case "automod":
			case "auto_mod":
				await databaseManager.setAutoMod(<Snowflake>context.guild?.id, channel);
				break;
			case "contextlogs":
			case "context_logs":
				await databaseManager.setMessage(<Snowflake>context.guild?.id, channel);
				break;
			case "rolelogs":
			case "role_logs":
				await databaseManager.setRole(<Snowflake>context.guild?.id, channel);
				break;
			case "memberlogs":
			case "member_logs":
				await databaseManager.setMember(<Snowflake>context.guild?.id, channel);
				break;
			case "channellogs":
			case "channel_logs":
				await databaseManager.setChannel(<Snowflake>context.guild?.id, channel);
				break;
			case "threadlogs":
			case "thread_logs":
				await databaseManager.setThread(<Snowflake>context.guild?.id, channel);
				break;
			case "invitelogs":
			case "invite_logs":
				await databaseManager.setInvite(<Snowflake>context.guild?.id, channel);
				break;
			case "joinleave":
			case "join_leave":
				await databaseManager.setJoinLeave(<Snowflake>context.guild?.id, channel);
				break;
			case "other":
				await databaseManager.setOther(<Snowflake>context.guild?.id, channel);
				break;
			case "all":
				const row = new MessageActionRow().addComponents([
					new MessageButton().setStyle("SUCCESS").setLabel("Confirm").setCustomId("confirm"),
					new MessageButton().setStyle("DANGER").setLabel("Cancel").setCustomId("cancel"),
				]);

				confirmMsg = await context.channel.send({ content: await this.client.bulbutils.translate("config_logging_all_confirm", context.guild?.id, { channel }), components: [row] });

				const filter = (i: ButtonInteraction) => i.user.id === context.author.id;
				let interaction: ButtonInteraction;

				try {
					interaction = await confirmMsg.awaitMessageComponent({ filter, time: 15000 });
				} catch (_) {
					await confirmMsg.delete();
					return await context.channel.send(await this.client.bulbutils.translate("global_execution_cancel", context.guild?.id, {}));
				}

				if (interaction.customId === "confirm") {
					await databaseManager.setModAction(<Snowflake>context.guild?.id, channel);
					await databaseManager.setAutoMod(<Snowflake>context.guild?.id, channel);
					await databaseManager.setMessage(<Snowflake>context.guild?.id, channel);
					await databaseManager.setRole(<Snowflake>context.guild?.id, channel);
					await databaseManager.setMember(<Snowflake>context.guild?.id, channel);
					await databaseManager.setChannel(<Snowflake>context.guild?.id, channel);
					await databaseManager.setThread(<Snowflake>context.guild?.id, channel);
					await databaseManager.setInvite(<Snowflake>context.guild?.id, channel);
					await databaseManager.setJoinLeave(<Snowflake>context.guild?.id, channel);
					await databaseManager.setOther(<Snowflake>context.guild?.id, channel);
					await confirmMsg.delete();
				} else {
					await confirmMsg.delete();
					await context.channel.send(await this.client.bulbutils.translate("global_execution_cancel", context.guild?.id, {}));
					return;
				}
				break;
			default:
				return await context.channel.send(
					await this.client.bulbutils.translate("event_message_args_missing_list", context.guild?.id, {
						argument: args[0].toLowerCase(),
						arg_expected: "part:string",
						argument_list: "`mute_role`, `mod_logs`, `automod`, `context_logs`, `role_logs`, `member_logs`, `channel_logs`, `thread_logs`, `invite_logs` ,`join_leave`, `other`, `all`",
					}),
				);
		}

		if (channel === null) {
			return await context.channel.send(
				await this.client.bulbutils.translate("config_logging_remove", context.guild?.id, {
					logging_type: part,
					channel: original,
				}),
			);
		} else {
			return await context.channel.send(
				await this.client.bulbutils.translate("config_logging_success", context.guild?.id, {
					logging_type: part,
					channel: context.guild?.channels.cache.get(channel),
				}),
			);
		}
	}
}
