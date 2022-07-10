import BulbBotClient from "../../../structures/BulbBotClient";
import { ButtonInteraction, CommandInteraction, Interaction, Message, MessageActionRow, MessageButton, MessageMentionOptions, Snowflake, TextChannel, User } from "discord.js";
import parse from "parse-duration";
import ReminderManager from "../../../utils/managers/ReminderManager";
import moment from "moment";
import { setTimeout } from "safe-timers";
import ApplicationSubCommand from "../../../structures/ApplicationSubCommand";
import ApplicationCommand from "../../../structures/ApplicationCommand";
import { ApplicationCommandOptionType } from "discord-api-types/v10";

const reminderManager: ReminderManager = new ReminderManager();

export default class extends ApplicationSubCommand {
	constructor(client: BulbBotClient, parent: ApplicationCommand) {
		super(client, parent, {
			name: "set",
			description: "Sets a reminder for you to do something in the future.",
			options: [
				{
					name: "duration",
					description: "The amount of time before the reminder occurs.",
					type: ApplicationCommandOptionType.String,
					required: true,
				},
				{
					name: "message",
					description: "The message to be sent when the reminder occurs.",
					type: ApplicationCommandOptionType.String,
					required: true,
				},
			],
		});
	}

	public async run(interaction: CommandInteraction): Promise<void> {
		const duration = parse(interaction.options.getString("duration") as string);
		const message = interaction.options.getString("message") as string;

		if (duration <= 0)
			return interaction.reply({
				content: await this.client.bulbutils.translate("duration_invalid_0s", interaction.guild?.id, {}),
				ephemeral: true,
			});
		if (duration > parse("1y"))
			return interaction.reply({
				content: await this.client.bulbutils.translate("duration_invalid_1y", interaction.guild?.id, {}),
				ephemeral: true,
			});

		const row = new MessageActionRow().addComponents([
			new MessageButton()
				.setCustomId("dm")
				.setLabel(await this.client.bulbutils.translate("remind_set_dm", interaction.guild?.id, {}))
				.setStyle("PRIMARY"),
			new MessageButton()
				.setCustomId("channel")
				.setLabel(await this.client.bulbutils.translate("remind_set_channel", interaction.guild?.id, {}))
				.setStyle("SUCCESS"),
		]);

		const row2 = new MessageActionRow().addComponents([
			new MessageButton()
				.setCustomId("dm")
				.setLabel(await this.client.bulbutils.translate("remind_set_dm", interaction.guild?.id, {}))
				.setStyle("PRIMARY")
				.setDisabled(true),
			new MessageButton()
				.setCustomId("channel")
				.setLabel(await this.client.bulbutils.translate("remind_set_channel", interaction.guild?.id, {}))
				.setStyle("SUCCESS")
				.setDisabled(true),
		]);

		const unixDuration = moment().add(duration, "ms").unix();

		await interaction.reply({
			content: await this.client.bulbutils.translate("remind_set_how_to_get_reminded", interaction.guild?.id, {}),
			components: [row],
			ephemeral: true,
		});

		const filter = (i: Interaction) => interaction.user.id === i.user.id;
		const collector = interaction.channel?.createMessageComponentCollector({ filter, max: 1, time: 15000, componentType: "BUTTON" });
		let reminder: any;

		collector?.on("collect", async (i: ButtonInteraction) => {
			if (i.customId === "dm") {
				reminder = await reminderManager.createReminder(message, unixDuration, interaction.user.id, "", "");
				await i.reply({
					content: await this.client.bulbutils.translate("remind_set_select_dm", interaction.guild?.id, { duration: unixDuration }),
					ephemeral: true,
				});
			} else {
				await i.reply(await this.client.bulbutils.translate("remind_set_select_channel", interaction.guild?.id, { duration: unixDuration }));
				reminder = await reminderManager.createReminder(message, unixDuration, interaction.user.id, interaction.channel?.id as Snowflake, (await i.fetchReply())?.id as Snowflake);
			}

			await interaction.editReply({ components: [row2] });

			setTimeout(async () => {
				if (!(await reminderManager.getReminder(reminder.id))) {
					await reminderManager.deleteReminder(reminder.id);
					return;
				}

				if (reminder.channelId !== "") {
					// @ts-expect-error
					const channel: TextChannel = await this.client.bulbfetch.getChannel(this.client.channels, reminder.channelId);
					let message: Message;
					const options: MessageMentionOptions = {
						repliedUser: true,
						users: [reminder.userId],
					};

					try {
						message = await channel.messages.fetch(reminder.messageId);
						await message.reply({
							content: `⏰ Your reminder from **${moment(Date.parse(reminder.createdAt)).format("MMM Do YYYY, h:mm:ss a")}**\n\n\`\`\`\n${reminder.reason}\`\`\``,
							allowedMentions: options,
						});
					} catch (_) {
						await channel.send({
							content: `⏰ <@${reminder.userId}> reminder from **${moment(Date.parse(reminder.createdAt)).format("MMM Do YYYY, h:mm:ss a")}**\n\n\`\`\`\n${reminder.reason}\`\`\``,
							allowedMentions: options,
						});
					}
				} else {
					const user: User | undefined = await this.client.bulbfetch.getUser(reminder.userId);
					if (!user) return;

					user.send(`⏰ Your reminder from **${moment(Date.parse(reminder.createdAt)).format("MMM Do YYYY, h:mm:ss a")}**\n\n\`\`\`\n${reminder.reason}\`\`\``).catch((_) => {
						this.client.log.info(`[REMIND - DM] Unable to dm ${user.tag} (${user.id}) with the reminder of ${reminder.reason}`);
					});
				}

				await reminderManager.deleteReminder(reminder.id);
			}, duration);
		});
	}
}
