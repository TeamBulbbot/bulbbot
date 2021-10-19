import Command from "../../../structures/Command";
import SubCommand from "../../../structures/SubCommand";
import CommandContext from "../../../structures/CommandContext";
import { ButtonInteraction, Message, MessageActionRow, MessageButton } from "discord.js";
import BulbBotClient from "../../../structures/BulbBotClient";
import LoggingManager from "../../../utils/managers/LoggingManager";
import BanpoolManager from "../../../utils/managers/BanpoolManager";

const { haveAccessToPool, deletePool, hasBanpoolLog }: BanpoolManager = new BanpoolManager();
const { sendEventLog }: LoggingManager = new LoggingManager();
export default class extends SubCommand {
	constructor(client: BulbBotClient, parent: Command) {
		super(client, parent, {
			name: "delete",
			aliases: ["del"],
			minArgs: 1,
			maxArgs: -1,
			argList: ["pool name:string"],
			usage: "<pool name>",
			clearance: 100,
		});
	}

	public async run(context: CommandContext, args: string[]): Promise<void | Message> {
		const name = args[0];

		if (!(await hasBanpoolLog(context.guild!?.id))) return context.channel.send(await this.client.bulbutils.translate("banpool_missing_logging", context.guild?.id, {}));
		if (!(await haveAccessToPool(context.guild!?.id, name))) return context.channel.send(await this.client.bulbutils.translate("banpool_missing_access_not_found", context.guild?.id, {}));

		const row = new MessageActionRow().addComponents([
			new MessageButton().setStyle("SUCCESS").setLabel("Confirm").setCustomId("confirm"),
			new MessageButton().setStyle("DANGER").setLabel("Cancel").setCustomId("cancel"),
		]);

		const confirmMsg = await context.channel.send({
			content: await this.client.bulbutils.translate("banpool_delete_message", context.guild?.id, {}),
			components: [row],
		});

		const collector = confirmMsg.createMessageComponentCollector({ time: 30000 });

		collector.on("collect", async (interaction: ButtonInteraction) => {
			if (interaction.user.id !== context.author.id) return interaction.reply({ content: await this.client.bulbutils.translate("global_not_invoked_by_user", context.guild?.id, {}), ephemeral: true });

			if (interaction.customId === "confirm") {
				collector.stop("clicked");

				await deletePool(name);

				await sendEventLog(
					this.client,
					context.guild!,
					"banpool",
					await this.client.bulbutils.translate("banpool_delete_success_log", context.guild?.id, {
						user: context.user,
						name,
					}),
				);

				return await interaction.update({
					content: await this.client.bulbutils.translate("banpool_delete_success", context.guild?.id, {}),
					components: [],
				});
			} else {
				collector.stop("clicked");
				return interaction.update({ content: await this.client.bulbutils.translate("global_execution_cancel", context.guild?.id, {}), components: [] });
			}
		});

		collector.on("end", async (_: ButtonInteraction, reason: string) => {
			if (reason !== "time") return;

			await confirmMsg.edit({ content: await this.client.bulbutils.translate("global_execution_cancel", context.guild?.id, {}), components: [] });
			return;
		});
	}
}
