import { PermissionResolvable } from "discord.js";
import { SubCommandClass } from "../../structures/SubCommand";

export default interface CommandOptions {
	name: string;
	aliases?: string[];
	description?: string;
	category?: string;
	usage?: string;
	examples?: string[];
	subCommands?: SubCommandClass[];
	userPerms?: PermissionResolvable;
	clientPerms?: PermissionResolvable;
	clearance?: number;
	subDevOnly?: boolean;
	devOnly?: boolean;
	premium?: boolean;
	maxArgs?: number;
	minArgs?: number;
	argList?: string[];
}
