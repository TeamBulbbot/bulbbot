const Discord = require("discord.js");

const Guild = require("../../models/guild");
const Emotes = require("../../emotes.json");
const Translator = require("../../utils/lang/translator");
const Logger = require("../../utils/other/winston");

module.exports = {
	name: "overrides",
	category: "configuration",
	description: "Get the overrides for the giving category",
	usage: "overrides <category>",
	clientPermissions: [
		"EMBED_LINKS",
		"SEND_MESSAGES",
		"VIEW_CHANNEL",
		"USE_EXTERNAL_EMOJIS",
	],
	userPermissions: ["MANAGE_GUILD"],
	clearanceLevel: 50,
	run: async (client, message, args) => {
		if (args[0] === undefined)
			return message.channel.send(
				Translator.Translate("overrides_missing_arg_category")
			);
		switch (args[0].toLowerCase()) {
			case "command":
			case "commands":
				Guild.findOne(
					{
						guildID: message.guild.id,
					},
					async (err, guild) => {
						if (err) Logger.error(err);

						let desc = ``;

						guild.overrideCommands.forEach((c) => {
							desc += emotify(c.enabled);
							desc += Translator.Translate(
								"overrides_with_clearance_level_command",
								{ cl_commandName: c.commandName, cL_CL: c.clearanceLevel }
							);
						});

						const embed = new Discord.MessageEmbed()
							.setColor(process.env.COLOR)
							.setTimestamp()
							.setFooter(
								`Executed by ${message.author.username}#${message.author.discriminator}`,
								message.author.avatarURL()
							)
							.setTitle(
								Translator.Translate("overrides_override_list_commands")
							)
							.setDescription(desc);

						return message.channel.send(embed);
					}
				);
				break;
			case "role":
			case "roles":
				Guild.findOne(
					{
						guildID: message.guild.id,
					},
					async (err, guild) => {
						if (err) Logger.error(err);

						let desc = ``;

						guild.moderationRoles.forEach((r) => {
							desc += Translator.Translate(
								"overrides_with_clearance_level_role",
								{ role_id: r.roleId, cL_CL: r.clearanceLevel }
							);
						});

						const embed = new Discord.MessageEmbed()
							.setColor(process.env.COLOR)
							.setTimestamp()
							.setFooter(
								`Executed by ${message.author.username}#${message.author.discriminator}`,
								message.author.avatarURL()
							)
							.setTitle(Translator.Translate("overrides_override_list_roles"))
							.setDescription(desc);

						return message.channel.send(embed);
					}
				);
				break;
			default:
				message.channel.send(
					`${Emotes.actions.warn} Invalid \`\`category\`\`\n${Emotes.other.tools} Correct usage of command: \`\`override <category>\`\`\n**List of categories:** \`\`command\`\`, \`\`role\`\``
				);
				break;
		}
	},
};

function emotify(text) {
	if (text) return Translator.Translate("overrides_enabled");
	else return Translator.Translate("overrides_disabled");
}
