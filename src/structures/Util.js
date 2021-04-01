const path = require("path");
const { promisify } = require("util");
const glob = promisify(require("glob"));

const Command = require("./Command.js");
const Event = require("./Event");

const { EventException } = require("./exceptions/EventException");
const { CommandException } = require("./exceptions/CommandException");

const metrics = require("../utils/prometheus/metrics");

module.exports = class Util {
	constructor(client) {
		this.client = client;
	}

	isClass(input) {
		return typeof input === "function" && typeof input.prototype === "object" && input.toString().substring(0, 5) === "class";
	}

	get directory() {
		return `${path.dirname(require.main.filename)}${path.sep}`;
	}

	async loadCommands() {
		console.log("[CLIENT] Started registering commands...");
		return glob(`${this.directory}commands/*/*.js`).then(commands => {
			for (const commandFile of commands) {
				delete require.cache[commandFile];
				const { name } = path.parse(commandFile);
				const File = require(commandFile);
				if (!this.isClass(File)) throw new CommandException(`Command '${name}' doesn't export a class.`);

				const command = new File(this.client, name.toLowerCase());
				if (!(command instanceof Command)) throw new CommandException(`Command '${name}' doesn't belong in Commands.`);

				this.client.commands.set(command.name, command);
				if (command.aliases.length) {
					for (const alias of command.aliases) {
						this.client.aliases.set(alias, command.name);
					}
				}
				// console.log(`Successfully registered command '${command.name}'`);
			}
			console.log("[CLIENT] Successfully registered all commands");
		});
	}

	async loadEvents() {
		console.log("[CLIENT] Started registering events...");
		return glob(`${this.directory}events/**/*.js`).then(events => {
			for (const eventFile of events) {
				delete require.cache[eventFile];
				const { name } = path.parse(eventFile);
				const File = require(eventFile);
				if (!this.isClass(File)) throw new EventException(`Event '${name}' doesn't export a class.`);

				const event = new File(this.client, name);
				if (!(event instanceof Event)) throw new EventException(`Event '${name}' doesn't belong in Events.`);

				this.client.events.set(event.name, event);
				event.emitter[event.type](name, async (...args) => {
					try {
						await event.run(...args);
					} catch (err) {
						await this.client.bulbutils.log(err);
					}

					metrics.client_event(event.name);
				});
				//console.log(`Successfully registered event '${event.name}'`);
			}
			console.log("[CLIENT] Successfully registered all events");
		});
	}
};
