import Command from "../../../structures/Command";
import SubCommand from "../../../structures/SubCommand";
import CommandContext from "../../../structures/CommandContext";
import { GuildChannel, GuildMember, Message, MessageActionRow, MessageButton, MessageComponentInteraction, Snowflake } from "discord.js";
import DatabaseManager from "../../../utils/managers/DatabaseManager";
import { NonDigits } from "../../../utils/Regex";
import BulbBotClient from "../../../structures/BulbBotClient";
import BanpoolManager from "../../../utils/managers/BanpoolManager";

const databaseManager: DatabaseManager = new DatabaseManager();
const { getPools }: BanpoolManager = new BanpoolManager();
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
			description: "Configure the logging of a part of the bot.",
		});
	}

	public async run(context: CommandContext, args: string[]): Promise<void | Message> {
		const part: string = args[0];
		let channel: string | null = args[1];
		let original: string = "";
		const loggingConfig: Record<string, any> = await databaseManager.getLoggingConfig(<Snowflake>context.guild?.id);
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

		const amtOfPools = (await getPools(context.guild!?.id)).length;
		if (channel === null && amtOfPools > 0 && (part === "banpoollogs" || part === "banpool_logs"))
			return await context.channel.send(await this.client.bulbutils.translate("configure_logging_banpool_with_still_pools", context.guild?.id, { amount: amtOfPools }));

		switch (part) {
			case "mod_actions":
			case "mod_logs":
			case "modlogs":
			case "modactions":
				await databaseManager.setModAction(<Snowflake>context.guild?.id, channel);
				original = loggingConfig["modAction"];
				break;
			case "banpoollogs":
			case "banpool_logs":
				await databaseManager.setBanpool(<Snowflake>context.guild?.id, channel);
				break;
			case "automod":
			case "auto_mod":
				await databaseManager.setAutoMod(<Snowflake>context.guild?.id, channel);
				original = loggingConfig["automod"];
				break;
			case "messagelogs":
			case "message_logs":
				await databaseManager.setMessage(<Snowflake>context.guild?.id, channel);
				original = loggingConfig["message"];
				break;
			case "rolelogs":
			case "role_logs":
				await databaseManager.setRole(<Snowflake>context.guild?.id, channel);
				original = loggingConfig["role"];
				break;
			case "memberlogs":
			case "member_logs":
				await databaseManager.setMember(<Snowflake>context.guild?.id, channel);
				original = loggingConfig["member"];
				break;
			case "channellogs":
			case "channel_logs":
				await databaseManager.setChannel(<Snowflake>context.guild?.id, channel);
				original = loggingConfig["channel"];
				break;
			case "threadlogs":
			case "thread_logs":
				await databaseManager.setThread(<Snowflake>context.guild?.id, channel);
				original = loggingConfig["thread"];
				break;
			case "invitelogs":
			case "invite_logs":
				await databaseManager.setInvite(<Snowflake>context.guild?.id, channel);
				original = loggingConfig["invite"];
				break;
			case "joinleave":
			case "join_leave":
				await databaseManager.setJoinLeave(<Snowflake>context.guild?.id, channel);
				original = loggingConfig["joinLeave"];
				break;
			case "other":
				await databaseManager.setOther(<Snowflake>context.guild?.id, channel);
				original = loggingConfig["other"];
				break;
			case "all":
				const row = new MessageActionRow().addComponents([
					new MessageButton().setStyle("SUCCESS").setLabel("Confirm").setCustomId("confirm"),
					new MessageButton().setStyle("DANGER").setLabel("Cancel").setCustomId("cancel"),
				]);

				confirmMsg = await context.channel.send({
					content: await this.client.bulbutils.translate(channel === null ? "config_logging_all_remove" : "config_logging_all_confirm", context.guild?.id, { channel }),
					components: [row],
				});

				const filter = (i: MessageComponentInteraction) => i.isButton() && i.user.id === context.author.id;
				let interaction: MessageComponentInteraction;

				try {
					interaction = await confirmMsg.awaitMessageComponent({ filter, time: 15000 });
				} catch (_) {
					await confirmMsg.delete();
					return await context.channel.send(await this.client.bulbutils.translate("global_execution_cancel", context.guild?.id, {}));
				}

				if (interaction.customId === "confirm") {
					await databaseManager.setModAction(<Snowflake>context.guild?.id, channel);
					await databaseManager.setBanpool(<Snowflake>context.guild?.id, channel);
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
						argument_list: "`mod_logs`, `automod`, `banpool_logs`, `message_logs`, `role_logs`, `member_logs`, `channel_logs`, `thread_logs`, `invite_logs` ,`join_leave`, `other`, `all`",
					}),
				);
		}

		if (channel === null) {
			return await context.channel.send(
				await this.client.bulbutils.translate(part === "all" ? "config_logging_remove_all" : "config_logging_remove", context.guild?.id, {
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
