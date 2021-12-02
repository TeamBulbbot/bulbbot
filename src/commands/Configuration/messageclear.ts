import Command from "../../structures/Command";
import CommandContext from "../../structures/CommandContext";
import DatabaseManager from "../../utils/managers/DatabaseManager";
import BulbBotClient from "../../structures/BulbBotClient";
import { MessageActionRow, MessageButton, ButtonInteraction } from "discord.js";

const { purgeMessagesInGuild, getServerArchive } = new DatabaseManager();

export default class extends Command {
	constructor(client: BulbBotClient, name: string) {
		super(client, {
			name,
			description: "clears X amount of messages from the database in the server",
			category: "Configuration",
			clearance: 100,
			usage: "<days>",
			examples: ["messageclear 5", "messageclear 10"],
			argList: ["days:number"],
			minArgs: 1,
			maxArgs: -1,
		});
	}

	async run(context: CommandContext, args: string[]) {
		const days = parseInt(args[0]);
		if (isNaN(Number(days))) return context.channel.send("Please enter a valid number of days.");
		if (days < 0) return context.channel.send("You can't clear messages that aren't there!");
		if (days > 30) return context.channel.send("You can't clear messages that are older than 30 days! (we already do that because of discord tos)");

		const amountOfMessages = (await getServerArchive(context.guild!.id)).length;
		const row = new MessageActionRow().addComponents([
			new MessageButton().setStyle("SUCCESS").setLabel("Confirm").setCustomId("confirm"),
			new MessageButton().setStyle("DANGER").setLabel("Cancel").setCustomId("cancel"),
		]);

		const confirmMsg = await context.channel.send({
			content: "you are about to delete " + amountOfMessages + " messages",
			components: [row],
		});

		const collector = confirmMsg.createMessageComponentCollector({ time: 30000 });

		collector.on("collect", async (interaction: ButtonInteraction) => {
			if (interaction.user.id !== context.author.id) {
				return interaction.reply({ content: await this.client.bulbutils.translate("global_not_invoked_by_user", context.guild?.id, {}), ephemeral: true });
			}

			if (interaction.customId === "confirm") {
				collector.stop("clicked");
				await purgeMessagesInGuild(context.guild!.id, days.toString());

				return await interaction.update({
					content: "bye bye messages",
					components: [],
				});
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

		return;
	}
}
