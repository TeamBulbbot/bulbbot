const Guild = require("../../models/guild");
const clc = require("cli-color");

module.exports = {
	name: "ro",
	category: "configuration",
	description: "Returns bot and API latency in milliseconds.",
	usage: "overridecommand",
	clientPermissions: ["SEND_MESSAGES", "VIEW_CHANNEL"],
	clearanceLevel: 75,
	run: async (client, message, args) => {
		const roleId = args[0].replace(/\D/g, "");
		const cL = args[1];

		Guild.findOne(
			{
				guildID: message.guild.id,
			},
			async (err, guild) => {
				const override = guild.moderationRoles.filter(function (c) {
					return c.roleId == roleId;
				});
				if (override.length === 0) {
					Guild.findOneAndUpdate(
						{ guildID: message.guild.id },
						{
							$push: {
								moderationRoles: {
									roleId: roleId,
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
						`Role override created for \`\`${roleId}\`\` with the clearance level of \`\`${cL}\`\``
					);
				} else {
					return message.channel.send(
						`There is already a role override for \`\`${roleId}\`\`.`
					);
				}
			}
		);
	},
};
