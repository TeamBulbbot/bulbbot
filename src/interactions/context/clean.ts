import BulbBotClient from "../../structures/BulbBotClient";
import { Collection, ContextMenuInteraction, Message, Snowflake } from "discord.js";
import moment from "moment";
import fs from "fs";
import LoggingManager from "../../utils/managers/LoggingManager";

const loggingManager: LoggingManager = new LoggingManager();

export default async function (client: BulbBotClient, interaction: ContextMenuInteraction, message: Message): Promise<void> {
	let amount = 100;
	const deleteMsg: number[] = [];
	let a = 0;

	for (let i = 1; i <= amount; i++) {
		if (i % 100 === 0) {
			deleteMsg.push(100);
			a = i;
		}
	}
	if (amount - a !== 0) deleteMsg.push(amount - a);

	if (!("name" in message.channel) || !message.guild) return;
	let delMsgs = `Message purge in #${message.channel.name} (${message.channel.id}) by ${message.author.tag} (${message.author.id}) at ${moment().format("MMMM Do YYYY, h:mm:ss a")} \n`;

	const messagesToPurge: Snowflake[] = [];
	amount = 0;

	for (let i = 0; i < deleteMsg.length; i++) {
		const msgs: Collection<string, Message> = await message.channel.messages.fetch({
			limit: deleteMsg[i],
		});

		msgs.map(async (m) => {
			if (message.author.id === m.author.id) {
				delMsgs += `${moment(m.createdTimestamp).format("MM/DD/YYYY, h:mm:ss a")} | ${m.author.tag} (${m.author.id}) | ${m.id} | ${m.content} |\n`;
				messagesToPurge.push(m.id);
				amount++;
			}
		});
	}

	await message.channel.bulkDelete(messagesToPurge);

	fs.writeFile(`${__dirname}/../../../files/PURGE-${message.guild.id}.txt`, delMsgs, function (err) {
		if (err) console.error(err);
	});

	await loggingManager.sendModActionFile(client, message.guild, "Purge", amount, `${__dirname}/../../../files/PURGE-${message.guild.id}.txt`, message.channel, message.author);

	await interaction.reply({ content: await client.bulbutils.translate("purge_success", message.guild.id, { count: amount }), ephemeral: true });
}
