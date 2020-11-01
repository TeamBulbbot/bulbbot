const Emotes = require("../../emotes.json");
const fs = require("fs");

module.exports = {
	name: "createdocs",
	category: "developer",
	description: "Create the new docs for the bot",
	usage: "createdocs",
	clientPermissions: ["SEND_MESSAGES", "VIEW_CHANNEL"],
	clearanceLevel: 0,
	run: async (client, message, _args) => {
		const developers = process.env.DEVELOPERS.split(",");

		if (developers.includes(message.author.id)) {
			const categorys = [
				"botinfo",
				"configuration",
				"information",
				"miscellaneous",
				"moderation",
			];
			let msg = "# Command list\n";

			categorys.forEach((cat) => {
				msg += `
## ${cat.charAt(0).toUpperCase() + cat.slice(1)}
| Command 	| Aliases 	| Default Clearance Level                             	| Description                                                     	| Usage              	| Bot Permssion                            	|
|---------	|---------	|-----------------------------------------------------	|-----------------------------------------------------------------	|--------------------	|------------------------------------------	|
`;

				client.commands.forEach((c) => {
					if (c.category === cat) {
						msg += `| ${c.name} | ${
							c.aliases > 0
								? `${c.aliases.join(", ")}`
								: c.aliases === undefined
								? "N/A"
								: `${c.aliases.join(", ")}`
						}| ${c.clearanceLevel} | ${c.description} | \`\`${
							c.usage
						}\`\` | ${c.clientPermissions.join(", ")} | \n`;
					}
				});
			});

			fs.writeFile(`./docs/commands.md`, msg, function (err) {
				if (err) return console.error(`[Create Docs] ${err}`);
			});
			return message.channel.send(
				`${Emotes.actions.confirm} Updated all the docs`
			);
		}
	},
};
