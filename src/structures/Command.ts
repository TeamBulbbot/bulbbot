import BulbBotClient from "./BulbBotClient";
import { BitField, GuildMember, Message, PermissionString, GuildChannelResolvable } from "discord.js";
import CommandException from "./exceptions/CommandException";
import { Permissions } from "discord.js";
import SubCommand from "./SubCommand";
import ClearanceManager from "../utils/managers/ClearanceManager";
import CommandOptions from "../utils/types/CommandOptions";
import ResolveCommandOptions from "../utils/types/ResolveCommandOptions";

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
	}

	public async run(message: Message, args: string[]): Promise<any> {
		if (!args.length || !this.subCommands.length) throw new CommandException(`Command \`${this.name}\` doesn't provide a run method!`);
		return await message.channel.send(
			await this.client.bulbutils.translate("event_message_args_missing_list", message.guild?.id, {
				argument: args[args.length - 1].toLowerCase(),
				arg_expected: this.argList[0],
				argument_list: this.subCommands.map(sc => `\`${sc.name}\``).join(", "),
			}),
		);
	}

	public async validate(message: Message, args: string[], options: ResolveCommandOptions): Promise<string | undefined> {
		if (this.premium && !options.premiumGuild) return await this.client.bulbutils.translate("global_premium_only", message.guild?.id, {});

		const commandOverride: Record<string, any> | undefined = await clearanceManager.getCommandOverride(message.guild!.id, this.name);
		if (commandOverride !== undefined) {
			if (!commandOverride["enabled"]) return "";
			if (commandOverride["clearanceLevel"] > options.clearance) {
				return await this.client.bulbutils.translate("global_missing_permissions", message.guild?.id, {});
			}
		}

		this.client.userClearance = options.clearance;
		if (this.clearance > options.clearance && !commandOverride) {
			return await this.client.bulbutils.translate("global_missing_permissions", message.guild?.id, {});
		}

		const userPermCheck: BitField<PermissionString, bigint> = this.userPerms;
		if (userPermCheck && this.clearance <= options.clearance) {
			const userMember: GuildMember = message.member!;
			const missing: boolean = !(userMember.permissions.has(userPermCheck) && userMember.permissionsIn(<GuildChannelResolvable>message.channel).has(userPermCheck)); // !x || !y === !(x && y)

			if (missing) {
				return await this.client.bulbutils.translate("global_missing_permissions", message.guild?.id, {});
			}
		}

		const clientPermCheck: BitField<PermissionString, bigint> = this.clientPerms ? this.client.defaultPerms.add(this.clientPerms) : this.client.defaultPerms;
		if (clientPermCheck) {
			let missing: PermissionString[] = message.guild?.me?.permissions.missing(clientPermCheck)!;
			if (!missing) return "";
			if (!missing.length) missing = message.guild!.me!.permissionsIn(<GuildChannelResolvable>message.channel).missing(clientPermCheck);

			if (missing.length)
				return await this.client.bulbutils.translate("global_missing_permissions_bot", message.guild?.id, {
					permissions: missing.map(perm => `\`${perm}\``).join(", "),
				});
		}

		if (this.subDevOnly) if (!options.isSubDev) return "";
		if (this.devOnly) if (!options.isDev) return "";

		if (this.maxArgs < args.length && this.maxArgs !== -1) {
			return await this.client.bulbutils.translate("event_message_args_unexpected", message.guild?.id, {
				argument: args[this.maxArgs],
				arg_expected: this.maxArgs,
				arg_provided: args.length,
				usage: `\`${this.client.prefix}${this.usage}\``,
			});
		}

		if (this.minArgs > args.length) {
			return await this.client.bulbutils.translate("event_message_args_missing", message.guild?.id, {
				argument: this.argList[args.length],
				arg_expected: this.minArgs,
				usage: `\`${this.client.prefix}${this.usage}\``,
			});
		}

		return;
	}

	public resolveSubcommand(commandPath: string[]): Command {
		for (const subCommand of this.subCommands) {
			if (commandPath[0].toLowerCase() === subCommand.name || subCommand.aliases.includes(commandPath[0].toLowerCase())) return subCommand;
		}

		return this;
	}

	static resolve(client: BulbBotClient, commandPath: string | string[]): undefined | Command {
		if(typeof commandPath === "string") commandPath = commandPath.split(" ");
		if(!commandPath.length) return;
		const cmd: string = commandPath[0];
		let command: Command | undefined = client.commands.get(cmd.toLowerCase()) || client.commands.get(client.aliases.get(cmd.toLowerCase())!);
		if (!command) return;

		for(let i = 1; i < commandPath.length; ++i) {
			let currCommand = command;
			command = command!.resolveSubcommand(commandPath.slice(i));
			if(command === currCommand) break;
		}

		return command;
	}
}
