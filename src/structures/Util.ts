import * as path from "path";
import { exec, cd } from "shelljs";
import BulbBotClient from "./BulbBotClient";
import { promisify } from "util";
import glob from "glob";
import Event from "./Event";
import EventException from "./exceptions/EventException";
import CommandException from "./exceptions/CommandException";
import Command from "./Command";
import DatabaseManager from "../utils/managers/DatabaseManager";

const databaseManager: DatabaseManager = new DatabaseManager();

const globAsync = promisify(glob);

export default class {
	private readonly client: BulbBotClient;

	constructor(client: BulbBotClient) {
		this.client = client;
	}

	isClass(input: any): boolean {
		return typeof input === "function" && typeof input.prototype === "object" && input.toString().substring(0, 5) === "class";
	}

	get directory(): string {
		return `${path.dirname(<string>require.main?.filename)}${path.sep}`;
	}

	async loadCommands(): Promise<void> {
		this.client.log.client("[CLIENT - COMMANDS] Started registering commands...");
		return globAsync(`${this.directory}commands/*/*.js`).then((commands: any) => {
			for (const commandFile of commands) {
				delete require.cache[commandFile];
				let { name } = path.parse(commandFile);
				let File = require(commandFile);
				if (!this.isClass(File.default)) throw new CommandException(`Command ${name} is not an instance of Command`);

				const command = new File.default(this.client, name);
				if (!(command instanceof Command)) throw new CommandException(`Event ${name} doesn't belong in commands!`);

				this.client.commands.set(command.name, command);
				if (command.aliases.length) {
					for (const alias of command.aliases) {
						this.client.aliases.set(alias, command.name);
					}
				}
			}
			this.client.log.client("[CLIENT - COMMANDS] Successfully registered all commands");
		});
	}

	async loadEvents(): Promise<void> {
		this.client.log.client("[CLIENT - EVENTS] Started registering events...");
		return globAsync(`${this.directory}events/**/*.js`).then((events: any) => {
			for (const eventFile of events) {
				delete require.cache[eventFile];
				const { name } = path.parse(eventFile);
				const File = require(eventFile);
				if (!this.isClass(File.default)) throw new EventException(`Event ${name} is not an instance of Event`);

				const event = new File.default(this.client, name);
				if (!(event instanceof Event)) throw new EventException(`Event ${name} doesn't belong in events!`);

				this.client.events.set(event.name, event);
				event.emitter[event.type](name, async (...args: any) => {
					await event.run(...args);
				});
			}
			this.client.log.client("[CLIENT - EVENTS] Successfully registered all events");
		});
	}

	async loadBlacklist(): Promise<void> {
		this.client.log.client("[CLIENT - BLACKLIST] Starting to load blacklisted users and guilds...");
		const blacklistedUsers: any = await databaseManager.getAllBlacklisted();
		for (let i = 0; i < blacklistedUsers.length; i++) {
			const blacklist = blacklistedUsers[i];
			this.client.blacklist.set(blacklist.snowflakeId, {
				type: blacklist.isGuild ? "guild" : "user",
				id: blacklist.snowflakeId,
			});
		}

		this.client.log.client(`[CLIENT - BLACKLIST] Successfully blacklisted ${this.client.blacklist.size} users and guilds`);
	}

	async loadAbout(): Promise<void> {
		cd(`${__dirname}/../../`);

		this.client.about = {
			buildId: exec(`git rev-list --all --count`, { silent: true }).stdout,
			build: {
				hash: exec(`git rev-parse --short HEAD`, { silent: true }).stdout,
				time: exec(`git log -1 --format=%cd`, { silent: true }).stdout,
			},
		};
	}
}
