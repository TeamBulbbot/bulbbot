import { NonDigits } from "../../../utils/Regex";
import { Message, Snowflake } from "discord.js";
import ClearanceManager from "../../../utils/managers/ClearanceManager";
import SubCommand from "../../../structures/SubCommand";

const clearanceManager: ClearanceManager = new ClearanceManager();

export default class extends SubCommand {
	constructor(...args: any) {
		// @ts-ignore
		super(...args, {
			name: "create",
			minArgs: 3,
			maxArgs: 3,
			argList: ["part:string", "name:string", "clearance:number"],
			usage: "configure override create <part> <name> <clearance>",
		});
	}

	async run( message: Message, args: string[]): Promise<void | Message> {
		const part: string = args[0];
		const name: string = args[1];
		let clearance: number = Number(args[2]);

		if (isNaN(clearance)) return message.channel.send(await this.client.bulbutils.translate("override_create_non_number", message.guild?.id, { clearance: args[2] }));
		if (clearance <= 0) return message.channel.send(await this.client.bulbutils.translate("override_create_less_than_0", message.guild?.id));
		if (clearance >= 100) return message.channel.send(await this.client.bulbutils.translate("override_create_more_than_100", message.guild?.id));

		if (clearance > this.client.userClearance) return message.channel.send(await this.client.bulbutils.translate("override_create_higher_than_yourself", message.guild?.id));

		// perhaps in this case we could inform user and ask if they'd like to edit? unlesss the clearance is the same ig
		if ((await clearanceManager.getCommandOverride(<Snowflake>message.guild?.id, name)) !== undefined)
			return await message.channel.send(await this.client.bulbutils.translate("override_already_exists", message.guild?.id));

		switch (part) {
			case "role":
				const rTemp = message.guild?.roles.cache.get(name.replace(NonDigits, ""));
				if (rTemp === undefined) return message.channel.send(await this.client.bulbutils.translate("override_create_invalid_role", message.guild?.id));

				await clearanceManager.createRoleOverride(<Snowflake>message.guild?.id, name.replace(NonDigits, ""), clearance);
				break;

			case "command":
				const command = this.client.commands.get(name.toLowerCase()) || this.client.commands.get(<string>this.client.aliases.get(name.toLowerCase()));
				if (command === undefined) return message.channel.send(await this.client.bulbutils.translate("override_create_invalid_command", message.guild?.id, { command: name }));

				await clearanceManager.createCommandOverride(<Snowflake>message.guild?.id, command.name, true, clearance);
				break;
			default:
				return message.channel.send(await this.client.bulbutils.translate("override_create_invalid_part", message.guild?.id));
		}
		await message.channel.send(await this.client.bulbutils.translate("override_create_success", message.guild?.id, { clearance }));
	}

}
