const Guild = require("../../models/guild");
const clc = require("cli-color");

module.exports = {
	name: "override",
	category: "configuration",
	description: "Returns bot and API latency in milliseconds.",
	usage: "override command",
	clientPermissions: ["SEND_MESSAGES", "VIEW_CHANNEL"],
	clearanceLevel: 75,
	run: async (client, message, args) => {
		const commandName = args[0];
		const cL = args[1];

		Guild.findOne(
			{
				guildID: message.guild.id,
			},
			async (err, guild) => {
				let override = guild.overrideCommands.filter(function (c) {
					return c.commandName == commandName;
				});
				if (override.length === 0) {
					Guild.findOneAndUpdate(
						{ guildID: message.guild.id },
						{
							$push: {
								overrideCommands: {
									commandName: commandName,
									enabled: true,
									clearanceLevel: cL,
								},
							},
						},
						{ upsert: true },
						function (err, _res) {
							if (err) {
								console.error(clc.red(err));
							}
						}
					);
					return message.channel.send(
						`Command override created for \`\`${commandName}\`\` with the clearance requirement of \`\`${cL}\`\``
					);
				} else {
					return message.channel.send(
						`There is already a command override for \`\`${commandName}\`\`.`
					);
				}
			}
		);
	},
};
