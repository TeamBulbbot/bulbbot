import { MessageActionRow, MessageButton, MessageComponentInteraction, MessageSelectMenu, MessageSelectOptionData, Snowflake, TextChannel } from "discord.js";
import BulbBotClient from "../../../structures/BulbBotClient";
import * as Emoji from "../../../emotes.json";
import DatabaseManager from "../../../utils/managers/DatabaseManager";
import { LoggingConfiguration } from "../../../utils/types/DatabaseStructures";

const databaseManager: DatabaseManager = new DatabaseManager();

async function logging(interaction: MessageComponentInteraction, client: BulbBotClient, channel?: TextChannel) {
	const config: LoggingConfiguration = await databaseManager.getLoggingConfig(interaction.guild?.id as Snowflake);
	let currPage = 0;
	const selectedChannel: TextChannel | undefined = channel;
	const selectedLogs: string[] = [];

	const channels: MessageSelectOptionData[] = [];
	if (selectedChannel)
		channels.push({
			label: selectedChannel.name,
			value: selectedChannel.id,
			default: true,
			emoji: Emoji.channel.TEXT,
		});

	await interaction.guild?.channels.fetch();
	interaction.guild?.channels.cache.map((channel) => {
		if (channel.type !== "GUILD_TEXT") return;
		if (selectedChannel && selectedChannel.id === channel.id) return;

		channels.push({
			label: channel.name,
			value: channel.id,
			emoji: Emoji.channel.TEXT,
			description: (channel as TextChannel).topic ? ((channel as TextChannel).topic?.slice(0, 100) as string) : undefined,
		});
	});

	const pages: MessageSelectOptionData[][] = channels.reduce((resultArray: any[], item: any, index: number) => {
		const chunkIndex = Math.floor(index / 25);

		if (!resultArray[chunkIndex]) {
			resultArray[chunkIndex] = []; // start a new chunk
		}

		resultArray[chunkIndex].push(item);

		return resultArray;
	}, []);

	const channelRow = new MessageActionRow().addComponents(new MessageSelectMenu().setCustomId("channel").setPlaceholder("Select a channel").setOptions(pages[currPage]));
	const logsRow = new MessageActionRow().addComponents(
		new MessageSelectMenu()
			.setCustomId("logs")
			.setPlaceholder("Select a logging type")
			.setOptions(loggingTypes(config, selectedChannel !== null ? selectedChannel : undefined))
			.setDisabled(!selectedChannel)
			.setMinValues(1),
	);
	const pageRow = new MessageActionRow().addComponents([
		new MessageButton()
			.setCustomId("page-back")
			.setLabel("<")
			.setStyle("PRIMARY")
			.setDisabled(currPage === 0),
		new MessageButton()
			.setCustomId("page-next")
			.setLabel(">")
			.setStyle("PRIMARY")
			.setDisabled(currPage === pages.length - 1),
		new MessageButton().setCustomId("enable").setLabel("Enable").setStyle("SUCCESS").setDisabled(!selectedChannel),
		new MessageButton().setCustomId("disable").setLabel("Disable").setStyle("DANGER").setDisabled(!selectedChannel),
	]);

	const backRow = new MessageActionRow().addComponents(new MessageButton().setCustomId("back").setLabel("Back").setStyle("DANGER"));

	await interaction.update({ content: "Logging Configuration", components: [channelRow, logsRow, pageRow, backRow] });

	const filter = (i: MessageComponentInteraction) => i.user.id === interaction.user.id;
	const collector = interaction.channel?.createMessageComponentCollector({ filter, time: 60000 });

	collector?.on("collect", async (i: MessageComponentInteraction) => {
		if (i.isSelectMenu()) {
			if (i.customId === "channel") {
				collector.stop();
				await logging(i, client, (await client.bulbfetch.getChannel(interaction.guild?.channels, i.values[0])) as TextChannel);
			} else {
				const logs: MessageSelectOptionData[] = loggingTypes(config, selectedChannel).map((type) => {
					if (i.values.includes(type.value)) selectedLogs.push(type.value);

					return {
						label: type.label,
						value: type.value,
						emoji: type.emoji,
						default: i.values.includes(type.value),
					};
				});

				// @ts-expect-error
				logsRow.components[0].setOptions(logs);

				await i.update({ components: [channelRow, logsRow, pageRow, backRow] });
			}
		} else if (i.isButton()) {
			switch (i.customId) {
				case "back":
					collector.stop();
					await require("./main").default(i, client);
					break;
				case "page-next":
					currPage++;
					// @ts-expect-error
					channelRow.components[0].setOptions(pages[currPage]);
					pageRow.components[0].setDisabled(currPage === 0);
					pageRow.components[1].setDisabled(currPage === pages.length - 1);

					await i.update({ components: [channelRow, logsRow, pageRow, backRow] });
					break;
				case "page-back":
					currPage--;
					// @ts-expect-error
					channelRow.components[0].setOptions(pages[currPage]);
					pageRow.components[0].setDisabled(currPage === 0);
					pageRow.components[1].setDisabled(currPage === pages.length);

					await i.update({ components: [channelRow, logsRow, pageRow, backRow] });
					break;
				case "enable":
					collector.stop();
					await setLogging(i, selectedChannel as TextChannel, selectedLogs, "enable");
					await interaction.followUp({ content: "Logging Enabled", ephemeral: true });
					await logging(i, client);
					break;
				case "disable":
					collector.stop();
					await setLogging(i, selectedChannel as TextChannel, selectedLogs, "disable");
					await interaction.followUp({ content: "Logging Disabled", ephemeral: true });
					await logging(i, client);
					break;
			}
		}
	});
}

async function setLogging(interaction: MessageComponentInteraction, selectedChannel: TextChannel, values: string[], action: "enable" | "disable") {
	for (const value of values) {
		switch (value) {
			case "mod_actions":
				await databaseManager.setModAction(interaction.guild?.id as Snowflake, action === "enable" ? selectedChannel.id : null);
				break;
			case "banpool_logs":
				await databaseManager.setBanpool(interaction.guild?.id as Snowflake, action === "enable" ? selectedChannel.id : null);
				break;
			case "automod":
				await databaseManager.setAutoMod(interaction.guild?.id as Snowflake, action === "enable" ? selectedChannel.id : null);
				break;
			case "message_logs":
				await databaseManager.setMessage(interaction.guild?.id as Snowflake, action === "enable" ? selectedChannel.id : null);
				break;
			case "role_logs":
				await databaseManager.setRole(interaction.guild?.id as Snowflake, action === "enable" ? selectedChannel.id : null);
				break;
			case "member_logs":
				await databaseManager.setMember(interaction.guild?.id as Snowflake, action === "enable" ? selectedChannel.id : null);
				break;
			case "channel_logs":
				await databaseManager.setChannel(interaction.guild?.id as Snowflake, action === "enable" ? selectedChannel.id : null);
				break;
			case "invite_logs":
				await databaseManager.setInvite(interaction.guild?.id as Snowflake, action === "enable" ? selectedChannel.id : null);
				break;
			case "join_leave_logs":
				await databaseManager.setJoinLeave(interaction.guild?.id as Snowflake, action === "enable" ? selectedChannel.id : null);
				break;
			case "thread_logs":
				await databaseManager.setThread(interaction.guild?.id as Snowflake, action === "enable" ? selectedChannel.id : null);
				break;
			case "other_logs":
				await databaseManager.setOther(interaction.guild?.id as Snowflake, action === "enable" ? selectedChannel.id : null);
				break;
		}
	}
}

function loggingTypes(config: LoggingConfiguration, channel?: TextChannel) {
	return [
		{ label: "Mod Actions", value: "mod_actions", emoji: channel !== undefined && config.modAction === channel.id ? Emoji.status.ONLINE : Emoji.other.INF2 },
		{ label: "Banpool Logs", value: "banpool_logs", emoji: channel !== undefined && config.banpool === channel.id ? Emoji.status.ONLINE : Emoji.other.INF2 },
		{ label: "Automod", value: "automod", emoji: channel !== undefined && config.automod === channel.id ? Emoji.status.ONLINE : Emoji.other.INF2 },
		{ label: "Message Logs", value: "message_logs", emoji: channel !== undefined && config.message === channel.id ? Emoji.status.ONLINE : Emoji.other.INF2 },
		{ label: "Role Logs", value: "role_logs", emoji: channel !== undefined && config.role === channel.id ? Emoji.status.ONLINE : Emoji.other.INF2 },
		{ label: "Member Logs", value: "member_logs", emoji: channel !== undefined && config.member === channel.id ? Emoji.status.ONLINE : Emoji.other.INF2 },
		{ label: "Channel Logs", value: "channel_logs", emoji: channel !== undefined && config.channel === channel.id ? Emoji.status.ONLINE : Emoji.other.INF2 },
		{ label: "Invite Logs", value: "invite_logs", emoji: channel !== undefined && config.invite === channel.id ? Emoji.status.ONLINE : Emoji.other.INF2 },
		{ label: "Join/Leave Logs", value: "join_leave_logs", emoji: channel !== undefined && config.joinLeave === channel.id ? Emoji.status.ONLINE : Emoji.other.INF2 },
		{ label: "Thread Logs", value: "thread_logs", emoji: channel !== undefined && config.thread === channel.id ? Emoji.status.ONLINE : Emoji.other.INF2 },
		{ label: "Other logs", value: "other_logs", emoji: channel !== undefined && config.other === channel.id ? Emoji.status.ONLINE : Emoji.other.INF2 },
	];
}

export default logging;
