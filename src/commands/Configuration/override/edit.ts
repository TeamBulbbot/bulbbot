import { NonDigits } from "../../../utils/Regex";
import { Message, Snowflake } from "discord.js";
import ClearanceManager from "../../../utils/managers/ClearanceManager";
import SubCommand from "../../../structures/SubCommand";

const clearanceManager: ClearanceManager = new ClearanceManager();

export default class extends SubCommand {
	constructor(...args: any) {
		// @ts-ignore
		super(...args, {
			name: "edit",
			minArgs: 3,
			maxArgs: 3,
			argList: ["part:string", "name:string", "clearance:number"],
			usage: "<part> <name> <clearance>",
		});
	}

	async run( message: Message, args: string[]): Promise<void | Message> {
		const part = args[0];
		const name = args[1];
		let clearance = Number(args[2]);

		if (isNaN(clearance))
			return message.channel.send(await this.client.bulbutils.translate("override_edit_non_number", message.guild?.id, { clearance: args[2] }));
		if (clearance <= 0) return message.channel.send(await this.client.bulbutils.translate("override_edit_less_than_0", message.guild?.id));
		if (clearance >= 100) return message.channel.send(await this.client.bulbutils.translate("override_edit_more_than_100", message.guild?.id));
		if (clearance > this.client.userClearance)
			return message.channel.send(await this.client.bulbutils.translate("override_edit_higher_than_yourself", message.guild?.id));

		switch (part) {
			case "role":
				const roleID = name.replace(NonDigits, "");
				const rTemp = message.guild?.roles.cache.get(roleID);
				if (rTemp === undefined) return message.channel.send(await this.client.bulbutils.translate("override_edit_invalid_role", message.guild?.id));

				if (await clearanceManager.getRoleOverride(<Snowflake>message.guild?.id, rTemp.id) === undefined)
					return message.channel.send(await this.client.bulbutils.translate("override_edit_non_existent_override_role", message.guild?.id));
				await clearanceManager.editRoleOverride(<Snowflake>message.guild?.id, roleID, clearance)
				break;

			case "command":
				const command = this.client.commands.get(name.toLowerCase()) || this.client.commands.get(<string>this.client.aliases.get(name.toLowerCase()));
				if (command === undefined)
					return message.channel.send(await this.client.bulbutils.translate("override_edit_invalid_command", message.guild?.id, { command: name }));

				if (await clearanceManager.getCommandOverride(<Snowflake>message.guild?.id, name) === undefined)
					return message.channel.send(await this.client.bulbutils.translate("override_edit_non_existent_override_command", message.guild?.id));
				await clearanceManager.editCommandOverride(<Snowflake>message.guild?.id, command.name, clearance)

				break;
			default:
				return message.channel.send(await this.client.bulbutils.translate("override_edit_invalid_part", message.guild?.id));
		}
		await message.channel.send(await this.client.bulbutils.translate("override_edit_success", message.guild?.id, { clearance }));
	}
}
