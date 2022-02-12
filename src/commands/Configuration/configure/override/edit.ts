import { NonDigits } from "../../../../utils/Regex";
import { ButtonInteraction, Message, MessageActionRow, MessageButton, Snowflake } from "discord.js";
import ClearanceManager from "../../../../utils/managers/ClearanceManager";
import Command from "../../../../structures/Command";
import SubCommand from "../../../../structures/SubCommand";
import CommandContext from "../../../../structures/CommandContext";
import BulbBotClient from "../../../../structures/BulbBotClient";

const clearanceManager: ClearanceManager = new ClearanceManager();

export default class extends SubCommand {
	constructor(client: BulbBotClient, parent: Command) {
		super(client, parent, {
			name: "edit",
			minArgs: 3,
			maxArgs: -1,
			argList: ["part:String", "name:String", "clearance:Number"],
			usage: "<part> <name> <clearance>",
			description: "Updates a clearance level.",
		});
	}

	async run(context: CommandContext, args: string[]): Promise<void | Message> {
		const part = args[0];
		let clearance = Number(args.at(-1));

		if (isNaN(clearance))
			return context.channel.send(
				await this.client.bulbutils.translate("global_not_found", context.guild?.id, {
					type: await this.client.bulbutils.translate("global_not_found_types.int", context.guild?.id, {}),
					arg_expected: "clearance:int",
					arg_provided: args[2],
					usage: this.usage,
				}),
			);
		if (clearance < 0) clearance = 0;
		if (clearance >= 100) return context.channel.send(await this.client.bulbutils.translate("override_clearance_more_than_100", context.guild?.id, {}));
		if (clearance > this.client.userClearance) return context.channel.send(await this.client.bulbutils.translate("override_clearance_higher_than_self", context.guild?.id, {}));

		switch (part) {
			case "role": {
				const name = args[1];
				const roleID = name.replace(NonDigits, "");
				const rTemp = context.guild?.roles.cache.get(roleID);
				if (rTemp === undefined)
					return context.channel.send(
						await this.client.bulbutils.translate("global_not_found", context.guild?.id, {
							type: await this.client.bulbutils.translate("global_not_found_types.role", context.guild?.id, {}),
							arg_expected: "role:Role",
							arg_provided: args[1],
							usage: this.usage,
						}),
					);

				if ((await clearanceManager.getRoleOverride(<Snowflake>context.guild?.id, rTemp.id)) === undefined)
					return context.channel.send(await this.client.bulbutils.translate("override_nonexistent_role", context.guild?.id, { role: rTemp.name }));
				await clearanceManager.editRoleOverride(<Snowflake>context.guild?.id, roleID, clearance);
				await context.channel.send(await this.client.bulbutils.translate("override_edit_success", context.guild?.id, { clearance }));
				break;
			}
			case "command": {
				const name = args.slice(1, -1);
				const command = Command.resolve(this.client, name);
				if (command === undefined)
					return context.channel.send(
						await this.client.bulbutils.translate("global_not_found", context.guild?.id, {
							type: await this.client.bulbutils.translate("global_not_found_types.cmd", context.guild?.id, {}),
							arg_expected: "command:string",
							arg_provided: name.join(" "),
							usage: this.usage,
						}),
					);

				if ((await clearanceManager.getCommandOverride(<Snowflake>context.guild?.id, command.qualifiedName)) === undefined)
					return context.channel.send(
						await this.client.bulbutils.translate("override_nonexistent_command", context.guild?.id, {
							command: command.qualifiedName,
						}),
					);

				if (clearance === 0 && (command.category === "Moderation" || command.category === "Configuration")) {
					const rowDisabled = new MessageActionRow().addComponents([
						new MessageButton().setStyle("SUCCESS").setLabel("Confirm").setCustomId("confirm").setDisabled(),
						new MessageButton().setStyle("DANGER").setLabel("Cancel").setCustomId("cancel").setDisabled(),
					]);

					const row = new MessageActionRow().addComponents([
						new MessageButton().setStyle("SUCCESS").setLabel("Confirm").setCustomId("confirm"),
						new MessageButton().setStyle("DANGER").setLabel("Cancel").setCustomId("cancel"),
					]);

					const msg: Message = await context.channel.send({ content: await this.client.bulbutils.translate("override_clearance_0_confirmation", context.guild?.id, {}), components: [rowDisabled] });
					await this.client.bulbutils.sleep(5000);
					await msg.edit({ components: [row] });

					const collector = msg.createMessageComponentCollector({ time: 30000 });

					collector.on("collect", async (interaction: ButtonInteraction) => {
						if (interaction.user.id !== context.author.id) {
							return interaction.reply({ content: await this.client.bulbutils.translate("global_not_invoked_by_user", context.guild?.id, {}), ephemeral: true });
						}

						if (interaction.customId === "confirm") {
							await interaction.update({ content: await this.client.bulbutils.translate("override_edit_success", context.guild?.id, { clearance }), components: [] });
							collector.stop("clicked");
							return clearanceManager.createCommandOverride(<Snowflake>context.guild?.id, command.qualifiedName, true, clearance);
						} else {
							collector.stop("clicked");
							return interaction.update({ content: await this.client.bulbutils.translate("global_execution_cancel", context.guild?.id, {}), components: [] });
						}
					});

					collector.on("end", async (interaction: ButtonInteraction, reason: string) => {
						if (reason !== "time") return;

						await msg.edit({ content: await this.client.bulbutils.translate("global_execution_cancel", context.guild?.id, {}), components: [] });
						return;
					});
				} else {
					await clearanceManager.editCommandOverride(<Snowflake>context.guild?.id, command.qualifiedName, clearance);
					await context.channel.send(await this.client.bulbutils.translate("override_edit_success", context.guild?.id, { clearance }));
				}
				break;
			}
			default:
				return context.channel.send(
					await this.client.bulbutils.translate("event_message_args_missing_list", context.guild?.id, {
						arg_expected: "part:string",
						argument: args[0],
						argument_list: "`role`, `command`",
					}),
				);
		}
	}
}
