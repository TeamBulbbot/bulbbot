import BulbBotClient from "../../../structures/BulbBotClient";
import Command from "../../../structures/Command";
import SubCommand from "../../../structures/SubCommand";
import CommandContext from "../../../structures/CommandContext";
import { Message, MessageEmbed } from "discord.js";
import ReminderManager from "../../../utils/managers/ReminderManager";
import { embedColor } from "../../../Config";

const { listUserReminders }: ReminderManager = new ReminderManager();

export default class extends SubCommand {
	constructor(client: BulbBotClient, parent: Command) {
		super(client, parent, {
			name: "list",
		});
	}

	public async run(context: CommandContext): Promise<void | Message> {
		const reminders: any = await listUserReminders(context.author.id);
		let desc: string = "";

		for (let i = 0; i < reminders.length; i++) {
			const reminder = reminders[i];
			desc += `\`[#${reminder.id}]\` ${reminder.reason} **expires** <t:${reminder.expireTime}:R>\n`;
		}

		const embed = new MessageEmbed()
			.setColor(embedColor)
			.setDescription(desc.length > 0 ? desc : await this.client.bulbutils.translate("remind_list_none", context.guild?.id, {}))
			.setAuthor(reminders.length === 10 ? await this.client.bulbutils.translate("remind_list_top10", context.guild?.id, {}) : "")
			.setFooter(
				await this.client.bulbutils.translate("global_executed_by", context.guild?.id, {
					user: context.author,
				}),
				await this.client.bulbutils.userObject(false, context.author).avatarUrl,
			)
			.setTimestamp();

		return context.channel.send({ embeds: [embed] });
	}
}
