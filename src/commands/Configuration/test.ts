import Command from "../../structures/Command";
import BulbBotClient from "../../structures/BulbBotClient";
import CommandContext from "../../structures/CommandContext";
import { Message, MessageActionRow, MessageComponentInteraction, MessageSelectMenu } from "discord.js";
import * as Config from "../../configure.json"

export default class extends Command {
	constructor(client: BulbBotClient, name: string) {
		super(client, {
			name,
			description: "Configure the bot in your server",
			category: "Configuration",
			usage: "<setting>",
			clearance: 75,
			userPerms: ["MANAGE_GUILD"],
		});
	}

	public async run(context: CommandContext): Promise<void> {
		let mainRow: MessageActionRow = new MessageActionRow().addComponents([
			new MessageSelectMenu().setPlaceholder("Select configure module").setCustomId("configure").addOptions(Config.mainMenu.mainRow)
		]);

		// @ts-ignore
		let backRow: MessageActionRow = new MessageActionRow().addComponents([
			Config.mainMenu.backRow
		])


		const msg: Message = await context.channel.send({ content: "YEEET", components: [mainRow, backRow] });

		const collector = await msg.createMessageComponentCollector({ time: 30000 });

		collector.on("collect", async (interaction: MessageComponentInteraction) => {
			if (interaction.isSelectMenu()) {
				mainRow = new MessageActionRow().addComponents([
					new MessageSelectMenu().setPlaceholder("Nothing selected").setCustomId(interaction.values[0]).addOptions(Config[interaction.values[0]]["mainRow"])
				]);

				backRow = new MessageActionRow().addComponents(Config[interaction.values[0]]["backRow"])
			}

			if (interaction.isButton()) {
				if (interaction.customId.startsWith("back")) {
					const page: string = interaction.customId.split("_")[1]
					mainRow = new MessageActionRow().addComponents(new MessageSelectMenu().setCustomId(page).addOptions(Config[page]["mainRow"]))
					backRow = new MessageActionRow().addComponents(Config[page]["backRow"])
				}
			}

			await interaction.update({ components: [mainRow, backRow] })
		});
	}
}
