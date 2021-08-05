import * as Emotes from "../../../emotes.json";
import { embedColor } from "../../../Config";
import { Message, MessageEmbed, Snowflake } from "discord.js";
import ClearanceManager from "../../../utils/managers/ClearanceManager";
import Command from "../../../structures/Command";
import SubCommand from "../../../structures/SubCommand";
import BulbBotClient from "../../../structures/BulbBotClient";

const clearanceManager: ClearanceManager = new ClearanceManager();

export default class extends SubCommand {
	constructor(client: BulbBotClient, parent: Command) {
		super(client, parent, {
			name: "list",
			maxArgs: 0,
			argList: ["command:string"],
		});
	}

	async run(message: Message): Promise<void | Message> {
		const data: Record<string, any> = await clearanceManager.getClearanceList(<Snowflake>message.guild?.id);

		let roles: string[] = [];
		let commands: string[] = [];

		if (data[0] !== undefined) {
			data[0].forEach(command => {
				commands.push(`\`${command.commandName}\` → \`${command.clearanceLevel}\`  ${command.enabled !== false ? Emotes.other.SWITCHON : Emotes.other.SWITCHOFF}`);
			});
		}

		if (data[1] !== undefined) {
			data[1].forEach(role => {
				roles.push(`<@&${role.roleId}> \`(${role.roleId})\` → \`${role.clearanceLevel}\``);
			});
		}

		// needs translation
		const embed: MessageEmbed = new MessageEmbed()
			.setColor(embedColor)
			.setAuthor(`Overrides for ${message.guild?.name}`, message.guild?.iconURL({ dynamic: true }) ?? undefined)
			.setDescription([...commands, ...roles].join("\n") || "*None*")
			.setFooter(
				await this.client.bulbutils.translateNew("global_executed_by", message.guild?.id, {
					user: message.author,
				}),
				message.author.avatarURL({ dynamic: true }) ?? undefined,
			);

		await message.channel.send(embed);
	}
}
