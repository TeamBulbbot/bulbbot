import { Message, MessageEmbed, Snowflake } from "discord.js";
import { embedColor } from "../../../../Config";
import * as Emotes from "../../../../emotes.json";
import BulbBotClient from "../../../../structures/BulbBotClient";
import Command from "../../../../structures/Command";
import SubCommand from "../../../../structures/SubCommand";
import CommandContext from "../../../../structures/CommandContext";
import ClearanceManager from "../../../../utils/managers/ClearanceManager";

const clearanceManager: ClearanceManager = new ClearanceManager();

export default class extends SubCommand {
	constructor(client: BulbBotClient, parent: Command) {
		super(client, parent, {
			name: "list",
			maxArgs: 0,
			argList: ["command:string"],
		});
	}

	async run(context: CommandContext): Promise<void | Message> {
		const data: Record<string, any> = await clearanceManager.getClearanceList(<Snowflake>context.guild?.id);

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
			.setAuthor(`Overrides for ${context.guild?.name}`, context.guild?.iconURL({ dynamic: true }) ?? undefined)
			.setDescription([...commands, ...roles].join("\n") || "*None*")
			.setFooter(
				await this.client.bulbutils.translate("global_executed_by", context.guild?.id, {
					user: context.author,
				}),
				context.author.avatarURL({ dynamic: true }) ?? undefined,
			);

		await context.channel.send({ embeds: [embed] });
	}
}
