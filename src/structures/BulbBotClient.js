const { Client, Collection, Permissions } = require("discord.js");
const Util = require("./Util");

const { PermissionException } = require("./exceptions/PermissionException");

module.exports = class BulbBotClient extends (
	Client
) {
	constructor(options = {}) {
		super({
			disableMentions: "everyone",
		});
		this.validate(options);

		this.commands = new Collection();
		this.aliases = new Collection();

		this.events = new Collection();

		this.utils = new Util(this);
	}

	validate(options) {
		if (typeof options !== "object") throw new TypeError("Options must be type of Object!");

		if (!options.token) throw new Error("Client cannot log in without token!");
		this.token = options.token;

		if (!options.prefix) throw new Error("Client cannot log in without prefix!");
		if (typeof options.prefix !== "string") throw new TypeError("Prefix must be type of String!");
		this.prefix = options.prefix;

		if (!options.defaultPerms) throw new PermissionException("Default permissions cannot be null!");
		this.defaultPerms = new Permissions(options.defaultPerms).freeze();

		if (!options.clearance) throw new Error("Clearance level cannot be null!");
		this.clearance = options.clearance;
	}

	async login(token = this.token) {
		await this.utils.loadEvents();
		await this.utils.loadCommands();
		await super.login(token);
	}
};
