import Command from "../../../structures/Command";
import SubCommand from "../../../structures/SubCommand";
import { Message, MessageEmbed } from "discord.js";
import BulbBotClient from "../../../structures/BulbBotClient";
import ReminderManager from "../../../utils/managers/ReminderManager";
import { embedColor } from "../../../Config";

const { listReminders }: ReminderManager = new ReminderManager();

export default class extends SubCommand {
	constructor(client: BulbBotClient, parent: Command) {
		super(client, parent, {
			name: "list",
		});
	}

	public async run(message: Message): Promise<void | Message> {
		const reminders: any = await listReminders(message.author.id);
		let desc: string = "";

		for (let i = 0; i < reminders.length; i++) {
			const reminder = reminders[i];
			desc += `\`[#${reminder.id}]\` ${reminder.reason} expires <t:${reminder.expireTime}:R>\n`;
		}

		const embed = new MessageEmbed()
			.setColor(embedColor)
			.setDescription(desc)
			.setAuthor("Only showing the top 10 closest reminders")
			.setFooter(
				await this.client.bulbutils.translate("global_executed_by", message.guild?.id, {
					user: message.author,
				}),
				await this.client.bulbutils.userObject(false, message.author).avatarUrl,
			)
			.setTimestamp();

		return message.channel.send({ embeds: [embed] });
	}
}
