import Command from "../../structures/Command";
import BulbBotClient from "../../structures/BulbBotClient";
import CommandContext from "../../structures/CommandContext";
import { Message, MessageActionRow, MessageButton, MessageComponentInteraction, MessageSelectMenu, MessageSelectOptionData } from "discord.js";
import * as Config from "../../configure.json";

const loggingMenus = [
	"selectedModActions",
	"selectedAutomod",
	"selectedMessage",
	"selecetedRole",
	"selectedMember",
	"selecetedChannel",
	"selectedThread",
	"selectedInvite",
	"selectedJoinLeave",
	"selectedOther",
];
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
			new MessageSelectMenu().setPlaceholder("Select configure module").setCustomId("configure").addOptions(Config.mainMenu.mainRow),
		]);

		let secondRow: MessageActionRow;
		let thirdRow: MessageActionRow;
		let fourthRow: MessageActionRow;

		const msg: Message = await context.channel.send({ content: "YEEET", components: [mainRow] });

		const collector = msg.createMessageComponentCollector({ time: 60000 });

		let topmenu = "";
		let page = "";

		collector.on("collect", async (interaction: MessageComponentInteraction) => {
			if (interaction.isSelectMenu()) {
				if (interaction.customId === "configure") {
					topmenu = interaction.values[0];
					secondRow = new MessageActionRow().addComponents([new MessageSelectMenu().setPlaceholder(topmenu).setCustomId(interaction.values[0]).addOptions(Config[topmenu]["mainRow"])]);
					//thirdrow = [];
					await interaction.update({ components: [mainRow, secondRow] });
				} else {
					page = interaction.values[0];
					console.log(topmenu, " : ", page);
					if (loggingMenus.includes(page)) {
						thirdRow = new MessageActionRow().addComponents([
							new MessageButton().setCustomId("select").setStyle("SUCCESS").setLabel("Select"),
							new MessageButton().setCustomId("disable").setStyle("DANGER").setLabel("Disable"),
							new MessageButton().setCustomId("beforepage").setStyle("PRIMARY").setLabel("<"),
							new MessageButton().setCustomId("nextpage").setStyle("PRIMARY").setLabel(">"),
						]);
						const channels: MessageSelectOptionData[] = [];

						context.guild?.channels.cache.map(channel => {
							if (channel.type === "GUILD_TEXT") {
								channels.push({
									label: channel.name,
									value: `channel-${channel.id}`,
									description: channel.parent?.name,
								});
							}
						});

						fourthRow = new MessageActionRow().addComponents([new MessageSelectMenu().setPlaceholder(topmenu).setCustomId("channel").addOptions(channels)]);

						await interaction.update({ components: [mainRow, secondRow, thirdRow, fourthRow] });
					}
				}
			}
		});
	}
}
