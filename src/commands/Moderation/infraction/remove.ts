import Command from "../../../structures/Command";
import SubCommand from "../../../structures/SubCommand";
import { ButtonInteraction, Message, MessageActionRow, MessageButton, Snowflake } from "discord.js";
import InfractionsManager from "../../../utils/managers/InfractionsManager";
import BulbBotClient from "../../../structures/BulbBotClient";
import { Infraction } from "../../../utils/types/Infraction";

const infractionsManager: InfractionsManager = new InfractionsManager();

export default class extends SubCommand {
	constructor(client: BulbBotClient, parent: Command) {
		super(client, parent, {
			name: "delete",
			aliases: ["del", "remove"],
			clearance: 50,
			minArgs: 1,
			maxArgs: 1,
			argList: ["infraction:int"],
			usage: "<infraction>",
		});
	}

	public async run(message: Message, args: string[]): Promise<void | Message> {
		const infID: number = Number(args[0]);

		if (isNaN(infID) || (await infractionsManager.getInfraction(<Snowflake>message.guild?.id, infID)) === undefined) {
			return message.channel.send(
				await this.client.bulbutils.translate("infraction_not_found", message.guild?.id, {
					infraction_id: args[0],
				}),
			);
		}

		const inf: Infraction = <Infraction>await infractionsManager.getInfraction(<Snowflake>message.guild?.id, infID);
		const target: Record<string, string> = { tag: inf.target, id: inf.targetId };
		const moderator: Record<string, string> = { tag: inf.moderator, id: inf.moderatorId };

		let confirmMsg: Message;

		const row = new MessageActionRow().addComponents([
			new MessageButton().setLabel("Confirm").setStyle("SUCCESS").setCustomId("confirm"),
			new MessageButton().setLabel("Cancel").setStyle("DANGER").setCustomId("cancel"),
		]);

		confirmMsg = await message.channel.send({
			content: await this.client.bulbutils.translate("infraction_delete_confirm", message.guild?.id, {
				infraction_id: inf.id,
				moderator,
				target,
				reason: inf["reason"],
			}),
			components: [row],
		});

		const filter = (i: ButtonInteraction) => i.user.id === message.author.id;
		await confirmMsg
			.awaitMessageComponent({ filter, time: 15000 })
			.then(async (interaction: ButtonInteraction) => {
				if (interaction.customId === "confirm") {
					await infractionsManager.deleteInfraction(<Snowflake>message.guild?.id, infID);
					await confirmMsg.delete();
					await message.channel.send(
						await this.client.bulbutils.translate("infraction_delete_success", message.guild?.id, {
							infraction_id: infID,
						}),
					);
				} else {
					await confirmMsg.delete();
					await message.channel.send(await this.client.bulbutils.translate("global_execution_cancel", message.guild?.id, {}));
				}
			})
			.catch(async _ => {
				await confirmMsg.delete();
				await message.channel.send(await this.client.bulbutils.translate("global_execution_cancel", message.guild?.id, {}));
			});
	}
}
