const Discord = require("discord.js");
const moment = require("moment");
const Command = require("../../structures/Command");
const { NonDigits } = require("../../utils/Regex");

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			description: "Gets information about a given snowflake",
			category: "Miscellaneous",
			usage: "!snowflake <snowflake>",
			argList: ["snowflake:integer"],
			minArgs: 1,
			maxArgs: -1,
		});
	}

	async run(message, args) {
		const snowflake = args[0].replace(NonDigits, "");
		if (snowflake <= Discord.SnowflakeUtil.EPOCH) return message.channel.send(this.client.bulbutils.translate("invalid_snowflake", { snowflake }));
		const deconstruct = Discord.SnowflakeUtil.deconstruct(snowflake);
		let passedAnything = false;

		let desc = `**❄️ [Snowflake](https://discord.com/developers/docs/reference#snowflakes) information**\n\n`;

		// Check if its a user
		if (!passedAnything) desc += this.client.bulbutils.translate("snowflake_info");

		desc += `**Creation**\n${formatDays(deconstruct.date)}\n`;

		const embed = new Discord.MessageEmbed()
			.setColor(global.config.embedColor)
			.setDescription(desc)
			.setFooter(
				this.client.bulbutils.translate("global_executed_by", {
					user_name: await this.client.bulbutils.userObject(true, message.member).username,
					user_discriminator: await this.client.bulbutils.userObject(true, message.member).discriminator,
				}),
				await this.client.bulbutils.userObject(true, message.member).avatarUrl,
			)
			.setTimestamp();

		return message.channel.send(embed);
	}
};

function formatDays(start) {
	const end = moment.utc().format("YYYY-MM-DD");
	const date = moment(moment.utc(start).format("YYYY-MM-DD"));
	const days = moment.duration(date.diff(end)).asDays();

	return `${moment.utc(start).format("MMMM, Do YYYY @ hh:mm:ss a")} \`\`(${Math.floor(days).toString().replace("-", "")} days ago)\`\`\n`;
}
