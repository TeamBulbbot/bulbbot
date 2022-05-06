import BulbBotClient from "./BulbBotClient";
import { CommandInteraction, Permissions, PermissionString } from "discord.js";
import { ApplicationCommandOptions, ApplicationCommandType } from "../utils/types/ApplicationCommands";

export default class ApplicationCommand {
	public readonly client: BulbBotClient;
	public readonly type: ApplicationCommandType;
	public readonly name: string;
	public readonly description: string;
	public readonly dm_permissions: boolean;
	public readonly default_member_permissions: string | null;
	public readonly command_permissions: PermissionString[];
	public readonly options: ApplicationCommandOptions[];

	constructor(client: BulbBotClient, options: any) {
		this.client = client;
		this.type = options.type;
		this.name = options.name;
		this.description = options.description;
		this.dm_permissions = options.dm_permissions || false;
		this.command_permissions = options.command_permissions || [];
		this.default_member_permissions = this._computePermissions();
		this.options = options.options || [];
	}

	private _computePermissions(): string | null {
		let permsBigInt = BigInt(0);

		for (const permission of this.command_permissions) {
			permsBigInt = permsBigInt | BigInt(Permissions[permission]);
		}

		return permsBigInt !== 0n ? permsBigInt.toString() : null;
	}

	public async run(_interaction: CommandInteraction): Promise<void> {
		throw new Error("Method not implemented.");
	}
}
