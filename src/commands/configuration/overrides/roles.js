const clc = require("cli-color");

const Guild = require("../../../models/guild");
const Emotes = require("../../../emotes.json");

module.exports = {
	Edit: (message, args) => {
		if (args[2] === undefined || args[2] === null)
			return message.channel.send(
				`${Emotes.actions.warn} Missing required argument \`\`role\`\`\n${Emotes.other.tools} Correct usage of command: \`\`override role edit <role> <clearance level>\`\``
			);
		if (args[3] === undefined || args[3] === null)
			return message.channel.send(
				`${Emotes.actions.warn} Missing required argument \`\`clearance level\`\`\n${Emotes.other.tools} Correct usage of command: \`\`override role edit <role> <clearance level>\`\``
			);

		const roleId = args[2].replace(/\D/g, "");
		const cL = args[3];

		if (cL < 0 || cL > 100)
			return message.channel.send(
				"The clearance level can't be less than ``0`` and not more than ``100``."
			);

		Guild.findOne(
			{
				guildID: message.guild.id,
			},
			async (err, guild) => {
				if (err) console.error(clc.red(err));
				const override = guild.moderationRoles.filter(function (c) {
					return c.roleId == roleId;
				});
				if (override.length !== 0) {
					Guild.findOneAndUpdate(
						{
							guildID: message.guild.id,
							"moderationRoles.roleId": roleId,
						},
						{
							$set: { "moderationRoles.$.clearanceLevel": cL },
						},
						{ upsert: true },
						function (err, _res) {
							if (err) console.error(clc.red(err));
						}
					);
					return message.channel.send(
						`Updated the role override for \`\`${roleId}\`\` with a new clearance level of \`\`${cL}\`\``
					);
				} else {
					return message.channel.send(
						`There is no override for \`\`${roleId}\`\`.`
					);
				}
			}
		);
	},

	Add: (message, args) => {
		if (args[2] === undefined || args[2] === null)
			return message.channel.send(
				`${Emotes.actions.warn} Missing required argument \`\`role\`\`\n${Emotes.other.tools} Correct usage of command: \`\`override role add <role> <clearance level>\`\``
			);
		if (args[3] === undefined || args[3] === null)
			return message.channel.send(
				`${Emotes.actions.warn} Missing required argument \`\`clearance level\`\`\n${Emotes.other.tools} Correct usage of command: \`\`override role add <role> <clearance level>\`\``
			);

		const roleId = args[2].replace(/\D/g, "");
		const cL = args[3];

		if (message.guild.roles.cache.get(roleId) === undefined)
			return message.channel.send(
				`${Emotes.actions.warn} Unable to find a role provided.`
			);

		if (cL < 0 || cL > 100)
			return message.channel.send(
				"The clearance level can't be less than ``0`` and not more than ``100``."
			);

		Guild.findOne(
			{
				guildID: message.guild.id,
			},
			async (err, guild) => {
				if (err) console.error(clc.red(err));
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
							if (err) console.error(clc.red(err));
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
