import Command from "../../../structures/Command";
import SubCommand from "../../../structures/SubCommand";
import { ButtonInteraction, Message, MessageActionRow, MessageButton, TextChannel, User } from "discord.js";
import BulbBotClient from "../../../structures/BulbBotClient";
import parse from "parse-duration";
import ReminderManager from "../../../utils/managers/ReminderManager";
import moment from "moment";

const { createReminder, getLatestReminder, deleteReminder, getReminder }: ReminderManager = new ReminderManager();

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

	public async run(message: Message, args: string[]): Promise<void | Message> {
		let duration: number = <number>parse(args[0]);
		const reason: string = args.slice(1).join(" ");

		if (duration <= 0) return message.channel.send(await this.client.bulbutils.translate("duration_invalid_0s", message.guild?.id, {}));
		if (duration > <number>parse("1y")) return message.channel.send(await this.client.bulbutils.translate("duration_invalid_1y", message.guild?.id, {}));

		const row = new MessageActionRow().addComponents([
			new MessageButton().setCustomId("dm").setLabel("Send reminder in DM").setStyle("PRIMARY"),
			new MessageButton().setCustomId("channel").setLabel("Send reminder in channel").setStyle("SUCCESS"),
		]);

		const row2 = new MessageActionRow().addComponents([
			new MessageButton().setCustomId("dm").setLabel("Send reminder in DM").setStyle("PRIMARY").setDisabled(true),
			new MessageButton().setCustomId("channel").setLabel("Send reminder in channel").setStyle("SUCCESS").setDisabled(true),
		]);

		duration = Math.floor(Date.now() / 1000) + duration / 1000;

		const msg: Message = await message.reply({
			content: `How would you like to get reminded?`,
			components: [row],
		});

		const filter = (i: any) => i.user.id === message.author.id;
		const collector = msg.createMessageComponentCollector({ filter, time: 15000 });

		collector.on("collect", async (interaction: ButtonInteraction) => {
			if (interaction.customId === "dm") {
				createReminder(reason, duration, message.author.id, "", "");
				interaction.reply(`Aight roger that will remind you in dms **<t:${duration}:R>**`);
			} else {
				createReminder(reason, duration, message.author.id, message.channel.id, message.id);
				interaction.reply(`Aight roger that will remind you here **<t:${duration}:R>**`);
			}

			msg.edit({ components: [row2] });
			let reminder: any = await getLatestReminder(message.author.id);

			setTimeout(async () => {
				if (!(await getReminder(reminder.id))) {
					deleteReminder(reminder.id);
					return;
				}

				if (reminder.channelId !== "") {
					// @ts-ignore
					const channel: TextChannel = await this.client.channels.fetch(reminder.channelId);
					const message: Message = await channel.messages.fetch(reminder.messageId);

					message.reply({
						content: `⏰ Your reminder from **${moment(Date.parse(reminder.createdAt)).format("MMM Do YYYY, h:mm:ss a")}**\n\n\`\`\`\n${reminder.reason}\`\`\``,
						allowedMentions: {
							repliedUser: true,
							users: [message.author.id],
						},
					});
				} else {
					const user: User = await this.client.users.fetch(reminder.userId);
					user.send(`⏰ Your reminder from **${moment(Date.parse(reminder.createdAt)).format("MMM Do YYYY, h:mm:ss a")}**\n\n\`\`\`\n${reminder.reason}\`\`\``);
				}

				deleteReminder(reminder.id);
			}, <number>parse(args[0]));
		});
	}
}
