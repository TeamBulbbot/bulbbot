import BulbBotClient from "./BulbBotClient";
import { BitField, GuildMember, PermissionString, GuildChannelResolvable , Permissions } from "discord.js";
import CommandException from "./exceptions/CommandException";
import SubCommand from "./SubCommand";
import ClearanceManager from "../utils/managers/ClearanceManager";
import CommandOptions from "../utils/types/CommandOptions";
import ResolveCommandOptions from "../utils/types/ResolveCommandOptions";
import CommandContext from "./CommandContext";
import { developers, subDevelopers } from "../Config";
import { GuildCommandOverride } from "../utils/types/DatabaseStructures";

const clearanceManager: ClearanceManager = new ClearanceManager();

export default class Command {
	public readonly client: BulbBotClient;
	public readonly name: string;
	public readonly aliases: string[];
	public readonly subCommands: SubCommand[];
	public readonly description: string;
	public readonly category: string;
	public readonly _usage: string;
	public readonly examples: string[];
	public readonly userPerms: Readonly<BitField<PermissionString, bigint>>;
	public readonly clientPerms: Readonly<BitField<PermissionString, bigint>>;
	public readonly clearance: number;
	public readonly subDevOnly: boolean;
	public readonly devOnly: boolean;
	public readonly premium: boolean;
	public readonly maxArgs: number;
	public readonly minArgs: number;
	public readonly argList: string[];
	public readonly depth: number;

	public readonly overrides: string[];

	get qualifiedName() {
		return this.name;
	}

	get usage() {
		return `${this.qualifiedName} ${this._usage}`.trim();
	}

	constructor(client: BulbBotClient, options: CommandOptions) {
		this.client = client;
		this.name = options.name;
		this.aliases = options.aliases || [];
		this.description = options.description || "No description provided";
		this.category = options.category || "Miscellaneous";
		this._usage = options.usage || "";
		this.examples = options.examples || [];
		this.depth = ~~options.depth!;
		this.userPerms = new Permissions(options.userPerms).freeze();
		this.clientPerms = new Permissions(options.clientPerms).freeze();
		this.clearance = options.clearance || 0;
		this.subDevOnly = options.subDevOnly || false;
		this.devOnly = options.devOnly || false;
		this.premium = options.premium || false;
		this.maxArgs = options.maxArgs || 0;
		this.minArgs = options.minArgs || 0;
		this.argList = options.argList || [];
		this.subCommands = options.subCommands?.map(sc => new sc(this.client, this)) || [];
		this.overrides = options.overrides || [];
	}

	public async run(context: CommandContext, args: string[]): Promise<any> {
		if (!args.length || !this.subCommands.length) throw new CommandException(`Command \`${this.name}\` doesn't provide a run method!`);
		return await context.channel.send(
			await this.client.bulbutils.translate("event_message_args_missing_list", context.guild?.id, {
				argument: args[0].toLowerCase(),
				arg_expected: this.argList[0],
				argument_list: this.subCommands.map(sc => `\`${sc.name}\``).join(", "),
			}),
		);
	}

	public getFullCommandName() {
		let name = "";
		let command = this;

		for (let i = 0; i <= this.depth; i++) {
			name = `${command.name} ${name}`;
			// @ts-expect-error
			command = command.parent;
		}

		return name;
	}

	public async validate(context: CommandContext, args: string[], options?: ResolveCommandOptions): Promise<string | undefined> {
		let clearance = this.clearance;

		if (options === undefined) {
			options = await ResolveCommandOptions.create(this, context, args);
		}
		if (this.premium && !options.premiumGuild) return await this.client.bulbutils.translate("global_premium_only", context.guild?.id, {});

		const commandOverride: GuildCommandOverride | undefined = await clearanceManager.getCommandOverride(context.guild!.id, this.qualifiedName);
		if (commandOverride !== undefined) {
			if (!commandOverride.enabled) {
				if (context.isMessageContext()) return "";
				else if (context.isInteractionContext()) return this.client.bulbutils.translate("global_command_disabled", context.guild?.id, {});
			}
			clearance = commandOverride.clearanceLevel;
		}

		this.client.userClearance = options.clearance;
		const userPermCheck: BitField<PermissionString, bigint> = this.userPerms;

		let missing: boolean = clearance > options.clearance;
		if (missing && ~~userPermCheck) {
			const userMember: GuildMember = context.member!;
			missing = !(userMember.permissions.has(userPermCheck) && userMember.permissionsIn(<GuildChannelResolvable>context.channel).has(userPermCheck)); // !x || !y === !(x && y)
		}
		if (missing) return await this.client.bulbutils.translate("global_missing_permissions", context.guild?.id, {});

		const clientPermCheck: BitField<PermissionString, bigint> = this.clientPerms ? this.client.defaultPerms.add(this.clientPerms) : this.client.defaultPerms;
		if (clientPermCheck) {
			let missing: PermissionString[] = context.guild?.me?.permissions.missing(clientPermCheck)!;
			if (!missing) return "";
			if (!missing.length) missing = context.guild!.me!.permissionsIn(<GuildChannelResolvable>context.channel).missing(clientPermCheck);

			if (missing.length)
				return await this.client.bulbutils.translate("global_missing_permissions_bot", context.guild?.id, {
					missing: missing.map(perm => `\`${perm}\``).join(", "),
				});
		}

		if (this.subDevOnly) if (!options.isSubDev) return "";
		if (this.devOnly) if (!options.isDev) return "";

		if (this.maxArgs < args.length && this.maxArgs !== -1) {
			return await this.client.bulbutils.translate("event_message_args_unexpected", context.guild?.id, {
				argument: args[this.maxArgs],
				arg_expected: this.maxArgs,
				arg_provided: args.length,
				usage: `\`${this.client.prefix}${this.usage}\``,
			});
		}

		if (this.minArgs > args.length) {
			return await this.client.bulbutils.translate("event_message_args_missing", context.guild?.id, {
				argument: this.argList[args.length],
				arg_expected: this.minArgs,
				usage: `\`${this.client.prefix}${this.usage}\``,
			});
		}

		return;
	}

	public async validateUserPerms(context: CommandContext): Promise<boolean> {
		let clearance = this.clearance;
		const isDev = developers.includes(context.author.id);
		const isSubDev = subDevelopers.includes(context.author.id);

		if (this.devOnly && !isDev) return false;
		if (this.subDevOnly && !(isDev || isSubDev)) return false;

		const commandOverride: GuildCommandOverride | undefined = await clearanceManager.getCommandOverride(context.guild!.id, this.qualifiedName);
		if (commandOverride !== undefined) {
			if (!commandOverride.enabled) return false;
			clearance = commandOverride["clearanceLevel"];
		}

		const userClearance = await clearanceManager.getUserClearance(context);
		const userPermCheck: BitField<PermissionString, bigint> = this.userPerms;

		let missing: boolean = clearance > userClearance;
		if (missing && ~~userPermCheck) {
			const userMember: GuildMember = context.member!;
			missing = !(userMember.permissions.has(userPermCheck) && userMember.permissionsIn(<GuildChannelResolvable>context.channel).has(userPermCheck)); // !x || !y === !(x && y)
		}
		return !missing;
	}

	public resolveSubcommand(commandPath: string[]): Command {
		for (const subCommand of this.subCommands) {
			if (commandPath[0].toLowerCase() === subCommand.name || subCommand.aliases.includes(commandPath[0].toLowerCase())) return subCommand;
		}

		return this;
	}

	static resolve(client: BulbBotClient, commandPath: string | string[]): undefined | Command {
		if (typeof commandPath === "string") commandPath = commandPath.split(" ");
		if (!commandPath.length) return;
		const cmd: string = commandPath[0];
		let command: Command | undefined = client.commands.get(cmd.toLowerCase()) || client.commands.get(client.aliases.get(cmd.toLowerCase())!);
		if (!command) return;

		for (let i = 1; i < commandPath.length; ++i) {
			const currCommand = command;
			command = command!.resolveSubcommand(commandPath.slice(i));
			if (command === currCommand) break;
		}

		return command;
	}
}
