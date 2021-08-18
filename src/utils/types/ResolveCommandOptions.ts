import { Message } from "discord.js";
import Command from "../../structures/Command";
import DatabaseManager from "../managers/DatabaseManager";
import ClearanceManager from "../../utils/managers/ClearanceManager";
import * as Config from "../../Config";

const databaseManager: DatabaseManager = new DatabaseManager();
const clearanceManager: ClearanceManager = new ClearanceManager();

interface ResolveCommandOptionsOptions {
	clearance?: number,
	premiumGuild?: boolean,
	isDev?: boolean,
	isSubDev?: boolean,
}

export default class ResolveCommandOptions {
	public message: Message;
	public baseCommand: Command;
	public args: string[];
	public clearance: number;
	public premiumGuild: boolean;
	public isDev: boolean;
	public isSubDev: boolean;

	constructor(command: Command, message: Message, args: string[], options: ResolveCommandOptionsOptions = {}) {
		this.baseCommand = command;
		this.message = message;
		this.args = args;
		if(options.clearance !== undefined) this.clearance = options.clearance;
		else {
			this.clearance = 0;
			clearanceManager.getUserClearance(message).then(c => this.clearance = c);
		}
		if(options.premiumGuild !== undefined) this.premiumGuild = options.premiumGuild;
		else {
			this.premiumGuild = false;
			databaseManager.getConfig(message.guild!.id).then(c => this.premiumGuild = c.premiumGuild);
		}
		if(options.isDev !== undefined) this.isDev = options.isDev;
		else {
			this.isDev = Config.developers.includes(message.author.id);
		}
		if(options.isSubDev !== undefined) this.isSubDev = options.isSubDev;
		else {
			this.isSubDev = Config.developers.includes(message.author.id) || Config.subDevelopers.includes(message.author.id);
		}
	}
}
