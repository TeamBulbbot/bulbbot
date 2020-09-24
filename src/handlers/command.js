const { readdirSync } = require("fs");
const ascii = require("ascii-table");
const table = new ascii("Discord Bot").setHeading("Command", "Status");

module.exports = (client) => {
	readdirSync("./commands/").forEach((dir) => {
		const commands = readdirSync(`./commands/${dir}/`).filter((f) => f.endsWith(".js"));

		for (let file of commands) {
			let pull = require(`../commands/${dir}/${file}`);

			if (pull.name) {
				client.commands.set(pull.name, pull);
				table.addRow(file, "✅");
			} else {
				table.addRow(file, "❌");
				continue;
			}

			if (pull.aliases && Array.isArray(pull.aliases)) pull.aliases.forEach((alias) => client.aliases.set(alias, pull.name));
		}

		console.log(table.toString());
	});
};
