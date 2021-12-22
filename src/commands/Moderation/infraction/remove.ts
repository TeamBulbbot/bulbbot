import Command from "../../../structures/Command";
import SubCommand from "../../../structures/SubCommand";
import CommandContext from "../../../structures/CommandContext";
import { ButtonInteraction, Message, MessageActionRow, MessageButton, Snowflake } from "discord.js";
import InfractionsManager from "../../../utils/managers/InfractionsManager";
import BulbBotClient from "../../../structures/BulbBotClient";
import { NonDigits } from "../../../utils/Regex";
import { Infraction } from "../../../utils/types/DatabaseStructures";

const infractionsManager: InfractionsManager = new InfractionsManager();

export default class extends SubCommand {
	constructor(client: BulbBotClient, parent: Command) {
		super(client, parent, {
			name: "delete",
			aliases: ["del", "remove"],
			clearance: 50,
			minArgs: 1,
			maxArgs: 1,
			argList: ["infraction:int32"],
			usage: "<infraction>",
			description: "Delete an infraction.",
		});
	}

	public async run(context: CommandContext, args: string[]): Promise<void | Message> {
		const infID = Number(args[0].replace(NonDigits, ""));

		if (!infID || infID >= 2147483647 || infID <= 0)
			return context.channel.send(
				await this.client.bulbutils.translate("global_cannot_convert", context.guild?.id, {
					type: await this.client.bulbutils.translate("global_not_found_types.int", context.guild?.id, {}),
					arg_expected: "id:int32",
					arg_provided: args[0],
					usage: this.usage,
				}),
			);

		if (isNaN(infID) || (await infractionsManager.getInfraction(<Snowflake>context.guild?.id, infID)) === undefined) {
			return context.channel.send(
				await this.client.bulbutils.translate("infraction_not_found", context.guild?.id, {
					infraction_id: args[0],
				}),
			);
		}

		const inf: Infraction = <Infraction>await infractionsManager.getInfraction(<Snowflake>context.guild?.id, infID);
		const target: Record<string, string> = { tag: inf.target, id: inf.targetId };
		const moderator: Record<string, string> = { tag: inf.moderator, id: inf.moderatorId };

		let confirmMsg: Message;

		const row = new MessageActionRow().addComponents([
			new MessageButton().setLabel("Confirm").setStyle("SUCCESS").setCustomId("confirm"),
			new MessageButton().setLabel("Cancel").setStyle("DANGER").setCustomId("cancel"),
		]);

		confirmMsg = await context.channel.send({
			content: await this.client.bulbutils.translate("infraction_delete_confirm", context.guild?.id, {
				infraction_id: inf.id,
				moderator,
				target,
				reason: inf["reason"],
			}),
			components: [row],
		});

		const collector = confirmMsg.createMessageComponentCollector({ time: 30000 });

		collector.on("collect", async (interaction: ButtonInteraction) => {
			if (interaction.user.id !== context.author.id) {
				return interaction.reply({ content: await this.client.bulbutils.translate("global_not_invoked_by_user", context.guild?.id, {}), ephemeral: true });
			}

			if (interaction.customId === "confirm") {
				await interaction.update({
					content: await this.client.bulbutils.translate("infraction_delete_success", context.guild?.id, {
						infraction_id: infID,
					}),
					components: [],
				});
				collector.stop("clicked");
				return await infractionsManager.deleteInfraction(<Snowflake>context.guild?.id, infID);
			} else {
				collector.stop("clicked");
				return interaction.update({ content: await this.client.bulbutils.translate("global_execution_cancel", context.guild?.id, {}), components: [] });
			}
		});

		collector.on("end", async (interaction: ButtonInteraction, reason: string) => {
			if (reason !== "time") return;

			await confirmMsg.edit({ content: await this.client.bulbutils.translate("global_execution_cancel", context.guild?.id, {}), components: [] });
			return;
		});
	}
}
