import Command from "../../structures/Command";
import CommandContext from "../../structures/CommandContext";
import BulbBotClient from "../../structures/BulbBotClient";
import { ButtonInteraction, MessageActionRow, MessageButton } from "discord.js";

export default class extends Command {
	constructor(client: BulbBotClient, name: string) {
		super(client, {
			name,
			description: "Idk",
			category: "Admin",
			subDevOnly: true,
		});
	}

	async run(context: CommandContext): Promise<void> {
		const row = new MessageActionRow().addComponents([
			new MessageButton().setStyle("SUCCESS").setLabel("UwU").setCustomId("confirm"),
			new MessageButton().setStyle("DANGER").setLabel("UwU").setCustomId("cancel"),
		]);

		const msg = await context.channel.send({ content: "Bulbchan UwU", components: [row] });

		const collector = msg.createMessageComponentCollector({ componentType: "BUTTON", time: 15000 });

		collector.on("collect", (i: ButtonInteraction) => {
			if (i.user.id === context.author.id) {
				i.reply({ content: "Bulbchan UwU" });
				collector.stop("clicked")
				return;
			} else {
				i.reply({ content: "Not UwU", ephemeral: true });
				return;
			}
		});

		collector.on("end", (interaction, reason: string) => {
			if (reason === "time") {
				msg.edit("Expired");
				return;
			} else {
				msg.edit("Clicked")
				return;
			}
		});

		context.channel.send("Another UwU that shouldn't execute")
	}
}
