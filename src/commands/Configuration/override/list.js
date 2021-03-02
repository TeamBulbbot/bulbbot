const ClearanceList = require("../../../utils/clearance/ClearanceList");
const Discord = require("discord.js");
const Emotes = require("../../../emotes.json");

module.exports = async (client, message, args) => {
	const data = await ClearanceList(message.guild.id);

	let roles = ``;
	let commands = ``;

	if (data.guildModerationRoles[0] !== undefined) {
		data.guildModerationRoles.forEach(role => {
			roles += `<@&${role.roleId}> \`(${role.roleId})\` → \`${role.clearanceLevel}\` \n`;
		});
	}
	if (data.guildOverrideCommands[0] !== undefined) {
		data.guildOverrideCommands.forEach(command => {
			commands += `\`${command.commandName}\` → \`${command.clearanceLevel}\`  ${
				command.enabled !== false ? Emotes.other.SWITCHON : Emotes.other.SWITCHOFF
			}\n`;
		});
	}

	const embed = new Discord.MessageEmbed()
		.setColor(global.config.embedColor)
		.setAuthor(`Overrides for ${message.guild.name}`, message.guild.iconURL({ dynamic: true }))
		.setDescription(roles + commands)
		.setFooter(
			await client.bulbutils.translate("global_executed_by", {
				user_name: await client.bulbutils.userObject(true, message.member).username,
				user_discriminator: await client.bulbutils.userObject(true, message.member).discriminator,
			}),
			await client.bulbutils.userObject(true, message.member).avatarUrl,
		)
		.setTimestamp();

	return message.channel.send(embed);
};
