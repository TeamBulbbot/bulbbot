import BulbBotClient from "../../../structures/BulbBotClient";
import Command from "../../../structures/Command";
import SubCommand from "../../../structures/SubCommand";
import CommandContext from "../../../structures/CommandContext";
import { ButtonInteraction, Message, MessageActionRow, MessageButton, TextChannel, User } from "discord.js";
import parse from "parse-duration";
import ReminderManager from "../../../utils/managers/ReminderManager";
import moment from "moment";
import { setTimeout } from "safe-timers";

const { createReminder, deleteReminder, getReminder }: ReminderManager = new ReminderManager();

export default class extends SubCommand {
	constructor(client: BulbBotClient, parent: Command) {
		super(client, parent, {
			name: "set",
			aliases: ["add"],
			minArgs: 2,
			maxArgs: -1,
			argList: ["duration:Duration", "reason:String"],
			usage: "<duration> <reason>",
		});
	}

	public async run(context: CommandContext, args: string[]): Promise<void | Message> {
		let duration: number = <number>parse(args[0]);
		const reason: string = args.slice(1).join(" ");

		if (duration <= 0) return context.channel.send(await this.client.bulbutils.translate("duration_invalid_0s", context.guild?.id, {}));
		if (duration > <number>parse("1y")) return context.channel.send(await this.client.bulbutils.translate("duration_invalid_1y", context.guild?.id, {}));

		const row = new MessageActionRow().addComponents([
			new MessageButton()
				.setCustomId("dm")
				.setLabel(await this.client.bulbutils.translate("remind_set_dm", context.guild?.id, {}))
				.setStyle("PRIMARY"),
			new MessageButton()
				.setCustomId("channel")
				.setLabel(await this.client.bulbutils.translate("remind_set_channel", context.guild?.id, {}))
				.setStyle("SUCCESS"),
		]);

		const row2 = new MessageActionRow().addComponents([
			new MessageButton()
				.setCustomId("dm")
				.setLabel(await this.client.bulbutils.translate("remind_set_dm", context.guild?.id, {}))
				.setStyle("PRIMARY")
				.setDisabled(true),
			new MessageButton()
				.setCustomId("channel")
				.setLabel(await this.client.bulbutils.translate("remind_set_channel", context.guild?.id, {}))
				.setStyle("SUCCESS")
				.setDisabled(true),
		]);

		duration = Math.floor(Date.now() / 1000) + duration / 1000;

		const msg: Message | void = await context.channel.send({
			content: await this.client.bulbutils.translate("remind_set_how_to_get_reminded", context.guild?.id, {}),
			components: [row],
		});
		if(!msg) return;

		const filter = (i: any) => i.user.id === context.author.id;
		const collector = msg.createMessageComponentCollector({ filter, time: 15000 });
		let reminder: any;

		collector.on("collect", async (interaction: ButtonInteraction) => {
			if (interaction.customId === "dm") {
				reminder = await createReminder(reason, duration, context.author.id, "", "");
				await interaction.reply(await this.client.bulbutils.translate("remind_set_select_dm", context.guild?.id, { duration }));
			} else {
				reminder = await createReminder(reason, duration, context.author.id, context.channel.id, context.id);
				await interaction.reply(await this.client.bulbutils.translate("remind_set_select_channel", context.guild?.id, { duration }));
			}

			await msg.edit({ components: [row2] });

			setTimeout(async () => {
				if (!(await getReminder(reminder.id))) return deleteReminder(reminder.id);

				if (reminder.channelId !== "") {
					// @ts-ignore
					const channel: TextChannel = await this.client.channels.fetch(reminder.channelId);
					let message: Message;
					let options: any = {
						allowedMentions: {
							repliedUser: true,
							users: [reminder.userId],
						},
					};

					try {
						message = await channel.messages.fetch(reminder.messageId);
						await message.reply({
							content: `⏰ Your reminder from **${moment(Date.parse(reminder.createdAt)).format("MMM Do YYYY, h:mm:ss a")}**\n\n\`\`\`\n${reminder.reason}\`\`\``,
							options,
						});
					} catch (_) {
						await channel.send({
							content: `⏰ <@${reminder.userId}> reminder from **${moment(Date.parse(reminder.createdAt)).format("MMM Do YYYY, h:mm:ss a")}**\n\n\`\`\`\n${reminder.reason}\`\`\``,
							options,
						});
					}
				} else {
					const user: User = await this.client.users.fetch(reminder.userId);

					user.send(`⏰ Your reminder from **${moment(Date.parse(reminder.createdAt)).format("MMM Do YYYY, h:mm:ss a")}**\n\n\`\`\`\n${reminder.reason}\`\`\``).catch(_ => {
						this.client.log.info(`[REMIND - DM] Unable to dm ${user.tag} (${user.id}) with the reminder of ${reminder.reason}`);
					});
				}

				await deleteReminder(reminder.id);
			}, <number>parse(args[0]));
		});
	}
}
