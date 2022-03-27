import Command from "../../structures/Command";
import DatabaseManager from "../managers/DatabaseManager";
import ClearanceManager from "../../utils/managers/ClearanceManager";
import * as Config from "../../Config";
import CommandContext from "src/structures/CommandContext";

const databaseManager: DatabaseManager = new DatabaseManager();
const clearanceManager: ClearanceManager = new ClearanceManager();

interface ResolveCommandOptionsOptions {
	clearance?: number;
	premiumGuild?: boolean;
	isDev?: boolean;
	isSubDev?: boolean;
}

export default class ResolveCommandOptions {
	public context: CommandContext;
	public baseCommand: Command;
	public args: string[];
	public clearance: number;
	public premiumGuild: boolean;
	public isDev: boolean;
	public isSubDev: boolean;

	static async create(command: Command, context: CommandContext, args: string[], options: ResolveCommandOptionsOptions = {}): Promise<ResolveCommandOptions> {
		const instance = new ResolveCommandOptions(command, context, args, options);
		instance.clearance = await clearanceManager.getUserClearance(context);
		instance.premiumGuild = !!context.guild?.id && (await databaseManager.getConfig(context.guild.id)).premiumGuild;
		return instance;
	}

	private constructor(command: Command, context: CommandContext, args: string[], options: ResolveCommandOptionsOptions = {}) {
		this.baseCommand = command;
		this.context = context;
		this.args = args;

		if (options.clearance !== undefined) this.clearance = options.clearance;
		else this.clearance = 0;

		if (options.premiumGuild !== undefined) this.premiumGuild = options.premiumGuild;
		else this.premiumGuild = false;

		if (options.isDev !== undefined) this.isDev = options.isDev;
		else this.isDev = Config.developers.includes(context.author.id);

		if (options.isSubDev !== undefined) this.isSubDev = options.isSubDev;
		else this.isSubDev = Config.developers.includes(context.author.id) || Config.subDevelopers.includes(context.author.id);
	}
}
