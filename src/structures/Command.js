const { CommandException } = require("./exceptions/CommandException");
const { Permissions } = require("discord.js");

module.exports = class Command {
	constructor(client, name, options = {}) {
		this.client = client;
		this.name = options.name || name;
		this.aliases = options.aliases || [];
		this.description = options.description || "No description provided";
		this.category = options.category || "Miscellaneous";
		this.usage = options.usage || "No usage provided";
		this.examples = options.examples || [];
		this.userPerms = new Permissions(options.userPerms).freeze();
		this.clientPerms = new Permissions(options.clientPerms).freeze();
		this.clearance = options.clearance || 0;
		this.devOnly = options.devOnly || false;
		this.premium = options.premium || false;
		this.maxArgs = options.maxArgs || 0;
		this.minArgs = options.minArgs || 0;
		this.argList = options.argList || [];
	}

	async run(_message, _args) {
		throw new CommandException(`Command ${this.name} doesn't contain a run method!`);
	}
};
