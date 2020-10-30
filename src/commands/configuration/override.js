const Emotes = require("../../emotes.json");
const Commands = require("./overrides/commands");
const Roles = require("./overrides/roles");

module.exports = {
	name: "override",
	category: "configuration",
	description: "Configure the overrides.",
	usage: "override <category> <sub category>",
	clientPermissions: ["SEND_MESSAGES", "VIEW_CHANNEL", "USE_EXTERNAL_EMOJIS"],
	clearanceLevel: 75,
	run: async (client, message, args) => {
		if (args[0] === undefined || args[0] === null)
			return message.channel.send(
				`${Emotes.actions.warn} Missing required argument \`\`category\`\`\n${Emotes.other.tools} Correct usage of command: \`\`override <category> <sub category>\`\`\n**List of categorys:** \`\`command\`\`, \`\`role\`\``
			);
		if (args[1] === undefined || args[1] === null) args[1] = "null";

		switch (args[0].toLowerCase()) {
			case "command":
			case "commands":
				switch (args[1].toLowerCase() || "") {
					case "edit":
					case "modify":
						Commands.Edit(message, args);
						break;
					case "new":
					case "add":
						Commands.New(client, message, args);
						break;
					case "disable":
						Commands.Disable(message, args);
						break;
					case "enable":
						Commands.Enable(message, args);
						break;
					default:
						message.channel.send(
							`${Emotes.actions.warn} Invalid \`\`sub category\`\`\n${Emotes.other.tools} Correct usage of command: \`\`override command <sub category>\`\`\n**List of sub categorys:** \`\`edit\`\`, \`\`add\`\`, \`\`disable\`\`, \`\`enable\`\``
						);
						break;
				}

				break;
			case "role":
			case "roles":
				switch (args[1].toLowerCase()) {
					case "edit":
					case "modify":
						Roles.Edit(message, args);
						break;
					case "new":
					case "add":
						Roles.Add(message, args);
						break;
					default:
						message.channel.send(
							`${Emotes.actions.warn} Invalid \`\`sub category\`\`\n${Emotes.other.tools} Correct usage of command: \`\`override role <sub category>\`\`\n**List of sub categorys:** \`\`edit\`\`, \`\`add\`\``
						);
						break;
				}

				break;
			default:
				message.channel.send(
					`${Emotes.actions.warn} Invalid \`\`category\`\`\n${Emotes.other.tools} Correct usage of command: \`\`override <category> <sub category>\`\`\n**List of categorys:** \`\`command\`\`, \`\`role\`\`\n**List of sub categorys:** \`\`edit\`\`, \`\`add\`\``
				);
				break;
		}
	},
};
