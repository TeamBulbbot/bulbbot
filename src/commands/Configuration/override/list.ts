import { Message, MessageEmbed, Snowflake } from "discord.js";
import ClearanceManager from "../../../utils/managers/ClearanceManager";
import * as Emotes from "../../../emotes.json";
import { embedColor } from "../../../Config";
import BulbBotClient from "../../../structures/BulbBotClient";

const clearanceManager: ClearanceManager = new ClearanceManager();

export default async function (client: BulbBotClient, message: Message, args: string[]): Promise<void | Message> {
	const data: object = await clearanceManager.getClearanceList(<Snowflake>message.guild?.id);

	let roles: string = "";
	let commands: string = "";

	if (data[0] !== undefined) {
		data[0].forEach(command => {
			commands += `\`${command.commandName}\` → \`${command.clearanceLevel}\`  ${command.enabled !== false ? Emotes.other.SWITCHON : Emotes.other.SWITCHOFF}\n`;
		});
	}

	if (data[1] !== undefined) {
		data[1].forEach(role => {
			roles += `<@&${role.roleId}> \`(${role.roleId})\` → \`${role.clearanceLevel}\` \n`;
		});
	}

	const embed: MessageEmbed = new MessageEmbed()
		.setColor(embedColor)
		.setAuthor(`Overrides for ${message.guild?.name}`, <string>message.guild?.iconURL({ dynamic: true }))
		.setDescription(commands + roles)
		.setFooter(
			await client.bulbutils.translate("global_executed_by", message.guild?.id, {
				user_name: message.author.username,
				user_discriminator: message.author.discriminator,
			}),
			<string>message.author.avatarURL({ dynamic: true }),
		);

	await message.channel.send(embed);
}
