import BulbBotClient from "./BulbBotClient";
import { CommandInteraction, Permissions, PermissionString } from "discord.js";
import { ApplicationCommandOptions, ApplicationCommandType } from "../utils/types/ApplicationCommands";
import { translateSlashCommands } from "../utils/InteractionCommands";

export default class ApplicationCommand {
	public readonly client: BulbBotClient;
	public readonly type: ApplicationCommandType;
	public readonly name: string;
	public readonly description: string;
	public readonly dm_permission: boolean;
	public readonly default_member_permissions: string | null;
	public readonly command_permissions: PermissionString[];
	public readonly client_permissions: PermissionString[];
	public readonly options: ApplicationCommandOptions[];

	constructor(client: BulbBotClient, { type, name, description, dm_permission, client_permissions, command_permissions, options }: any) {
		this.client = client;
		this.type = type;
		this.name = name;
		this.description = description;
		this.dm_permission = dm_permission || false;
		this.command_permissions = command_permissions || [];
		this.client_permissions = client_permissions || [];
		this.default_member_permissions = this._computePermissions();
		this.options = this.appendTranslation(options) || [];
	}

	private applyTranslation(options: ApplicationCommandOptions[], name: string) {
		for (const optionCommand of options) {
			optionCommand.name_localizations = translateSlashCommands(`${name}_${optionCommand.name}_name`);
			optionCommand.description_localizations = translateSlashCommands(`${name}_${optionCommand.name}_desc`);

			if (`${name}_${optionCommand.name}_name`.length > 32 || `${name}_${optionCommand.name}_desc`.length > 32)
				throw Error(`Too long of a name for slash commands: ${optionCommand.name} is too long for the slashcommand to register (over 32 characters)`);

			if (optionCommand.options) this.applyTranslation(optionCommand.options, `${name}_${optionCommand.name}`);
		}
	}

	public validateClientPermissions(interactions: CommandInteraction): boolean | string {
		const missing: string[] = [];

		for (const permission of this.client_permissions) {
			if (!interactions.guild?.me?.permissions.has(permission)) missing.push(permission);
		}

		return missing.length ? missing.join(", ") : true;
	}

	private appendTranslation(options: ApplicationCommandOptions[]): ApplicationCommandOptions[] {
		if (!options) return [];
		this.applyTranslation(options ?? [], `sc_${this.name}`);
		return options;
	}

	private _computePermissions(): string | null {
		let permsBigInt = BigInt(0);

		for (const permission of this.command_permissions) {
			permsBigInt = permsBigInt | BigInt(Permissions.FLAGS[permission]);
		}

		return permsBigInt !== 0n ? permsBigInt.toString() : null;
	}

	public async run(_interaction: CommandInteraction): Promise<void> {
		throw new Error("Method not implemented.");
	}
}