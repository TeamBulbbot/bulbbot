import Command from "../../structures/Command";
import CommandContext from "../../structures/CommandContext";
import { SnowflakeUtil, DeconstructedSnowflake, MessageEmbed } from "discord.js";
import { NonDigits } from "../../utils/Regex";
import * as Config from "../../Config";
import BulbBotClient from "../../structures/BulbBotClient";
import moment from "moment";

export default class extends Command {
	constructor(client: BulbBotClient, name: string) {
		super(client, {
			name,
			description: "Gets information about a given snowflake",
			category: "Miscellaneous",
			usage: "<snowflake>",
			examples: ["snowflake 123456789012345678"],
			argList: ["snowflake:Snowflake"],
			minArgs: 1,
			maxArgs: -1,
			clientPerms: ["EMBED_LINKS"],
		});
	}

	async run(context: CommandContext, args: string[]) {
		const snowflake: string = args[0].replace(NonDigits, "");
		if (+snowflake <= SnowflakeUtil.EPOCH)
			return context.channel.send(
				await this.client.bulbutils.translate("global_cannot_convert", context.guild?.id, {
					arg_provided: args[0],
					arg_expected: "snowflake:Snowflake",
					usage: this.usage,
				}),
			);
		const deconstruct: DeconstructedSnowflake = SnowflakeUtil.deconstruct(snowflake);

		let desc = `**❄️ [Snowflake](https://discord.com/developers/docs/reference#snowflakes) information**\n\n`;

		desc += `**Creation:** <t:${moment(deconstruct.date).unix()}:F> (<t:${moment(deconstruct.date).unix()}:R>)\n`;
		desc += `**Timestamp:** ${deconstruct.timestamp}\n`;
		desc += `**Worker Id:** ${deconstruct.workerId}\n`;
		desc += `**Process Id:** ${deconstruct.processId}\n`;
		desc += `**Increment:** ${deconstruct.increment}\n`;
		desc += `**Binary:** ${deconstruct.binary}\n`;

		const embed = new MessageEmbed()
			.setColor(Config.embedColor)
			.setDescription(desc)
			.setFooter({
				text: await this.client.bulbutils.translate("global_executed_by", context.guild?.id, {
					user: context.author,
				}),
				iconURL: <string>context.author.avatarURL({ dynamic: true }),
			})
			.setTimestamp();

		return context.channel.send({ embeds: [embed] });
	}
}
