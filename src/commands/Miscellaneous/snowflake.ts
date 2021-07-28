import { SnowflakeUtil, DeconstructedSnowflake, Message, MessageEmbed } from "discord.js";
import Command from "../../structures/Command";
import { NonDigits } from "../../utils/Regex";
import * as Config from "../../Config";

export default class extends Command {
	constructor(...args) {
        // @ts-ignore
		super(...args, {
			description: "Gets information about a given snowflake",
			category: "Miscellaneous",
			usage: "!snowflake <snowflake>",
			examples: ["snowflake 190160914765316096"],
			argList: ["snowflake:integer"],
			minArgs: 1,
			maxArgs: -1,
			clientPerms: ["EMBED_LINKS"],
		});
	}

	async run(message: Message, args: string[]) {
		const snowflake: string = args[0].replace(NonDigits, "");
		if (+snowflake <= SnowflakeUtil.EPOCH)
			return message.channel.send(await this.client.bulbutils.translate("invalid_snowflake", message.guild?.id, { snowflake }));
		const deconstruct: DeconstructedSnowflake = SnowflakeUtil.deconstruct(snowflake);

		let desc = `**❄️ [Snowflake](https://discord.com/developers/docs/reference#snowflakes) information**\n\n`;

		desc += `**Creation**\n${this.client.bulbutils.formatDays(deconstruct.date)}\n`;
		desc += `**Timestamp**\n${deconstruct.timestamp}\n\n`;
		desc += `**Binary**\n${deconstruct.binary}\n`;

		const embed = new MessageEmbed()
			.setColor(Config.embedColor)
			.setDescription(desc)
			.setFooter(
				await this.client.bulbutils.translate("global_executed_by", message.guild?.id, {
					user_name: message.author.username,
					user_discriminator: message.author.discriminator,
				}),
				await this.client.bulbutils.userObject(false, message.author).avatarUrl,
			)
			.setTimestamp();

		return message.channel.send(embed);
	}
};
