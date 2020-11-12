const Guild = require("../../../models/guild");
const Emotes = require("../../../emotes.json");
const Logger = require("../../../utils/other/winston");

module.exports = {
	Edit: (message, args) => {
		if (args[2] === undefined)
			return message.channel.send(
				`${Emotes.actions.warn} Missing required argument \`\`command name\`\`\n${Emotes.other.tools} Correct usage of command: \`\`override command edit <command name> <clearance level>\`\``
			);
		if (args[3] === undefined)
			return message.channel.send(
				`${Emotes.actions.warn} Missing required argument \`\`clearance level\`\`\n${Emotes.other.tools} Correct usage of command: \`\`override command edit <command name> <clearance level>\`\``
			);

		const commandName = args[2];
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
				if (err) Logger.error(err);
				let override = guild.overrideCommands.filter(function (c) {
					return c.commandName == commandName;
				});
				if (override.length !== 0) {
					Guild.findOneAndUpdate(
						{
							guildID: message.guild.id,
							"overrideCommands.commandName": commandName,
						},
						{
							$set: { "overrideCommands.$.clearanceLevel": cL },
						},
						{ upsert: true },
						function (err, _res) {
							if (err) Logger.error(err);
						}
					);
					return message.channel.send(
						`Updated the command override for \`\`${commandName}\`\` with a new clearance level of \`\`${cL}\`\``
					);
				} else {
					return message.channel.send(
						`There is no override for \`\`${commandName}\`\`.`
					);
				}
			}
		);
	},

	New: (client, message, args) => {
		if (args[2] === undefined || args[2] === null)
			return message.channel.send(
				`${Emotes.actions.warn} Missing required argument \`\`command name\`\`\n${Emotes.other.tools} Correct usage of command: \`\`override command add <command name> <clearance level>\`\``
			);
		if (args[3] === undefined || args[3] === null)
			return message.channel.send(
				`${Emotes.actions.warn} Missing required argument \`\`clearance level\`\`\n${Emotes.other.tools} Correct usage of command: \`\`override command add <command name> <clearance level>\`\``
			);

		const commandName = args[2];
		const cL = args[3];

		let fCommand = client.commands.filter(function (c) {
			return c.name == commandName;
		});

		if (fCommand.size === 0)
			return message.channel.send(
				`Unable to find the command with the name \`\`${commandName}\`\``
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
				if (err) Logger.error(err);
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
							if (err) Logger.error(err);
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

	Disable: (message, args) => {
		if (args[2] === undefined || args[2] === null)
			return message.channel.send(
				`${Emotes.actions.warn} Missing required argument \`\`command name\`\`\n${Emotes.other.tools} Correct usage of command: \`\`override command disable <command name>\`\``
			);

		const commandName = args[2];

		Guild.findOne(
			{
				guildID: message.guild.id,
			},
			async (err, guild) => {
				if (err) Logger.error(err);
				let override = guild.overrideCommands.filter(function (c) {
					return c.commandName == commandName;
				});
				if (override.length !== 0) {
					Guild.findOneAndUpdate(
						{
							guildID: message.guild.id,
							"overrideCommands.commandName": commandName,
						},
						{
							$set: { "overrideCommands.$.enabled": false },
						},
						{ upsert: true },
						function (err, _res) {
							if (err) Logger.error(err);
						}
					);
					return message.channel.send(
						`Disabled the command \`\`${commandName}\`\``
					);
				} else {
					return message.channel.send(
						`There is no override for \`\`${commandName}\`\`.`
					);
				}
			}
		);
	},

	Enable: (message, args) => {
		if (args[2] === undefined || args[2] === null)
			return message.channel.send(
				`${Emotes.actions.warn} Missing required argument \`\`command name\`\`\n${Emotes.other.tools} Correct usage of command: \`\`override command enable <command name>\`\``
			);

		const commandName = args[2];

		Guild.findOne(
			{
				guildID: message.guild.id,
			},
			async (err, guild) => {
				if (err) Logger.error(err);
				let override = guild.overrideCommands.filter(function (c) {
					return c.commandName == commandName;
				});
				if (override.length !== 0) {
					Guild.findOneAndUpdate(
						{
							guildID: message.guild.id,
							"overrideCommands.commandName": commandName,
						},
						{
							$set: { "overrideCommands.$.enabled": true },
						},
						{ upsert: true },
						function (err, _res) {
							if (err) Logger.error(err);
						}
					);
					return message.channel.send(
						`Enabled the command \`\`${commandName}\`\``
					);
				} else {
					return message.channel.send(
						`There is no override for \`\`${commandName}\`\`.`
					);
				}
			}
		);
	},
};
