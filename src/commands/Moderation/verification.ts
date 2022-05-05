import Command from "../../structures/Command";
import CommandContext from "../../structures/CommandContext";
import { ButtonInteraction, Message, MessageActionRow, MessageButton } from "discord.js";
import BulbBotClient from "../../structures/BulbBotClient";

const levels = {
	levelNone: 0,
	levelLow: 1,
	levelMedium: 2,
	levelHigh: 3,
	levelVeryHigh: 4,
};

const verificationLevel = {
	NONE: "levelNone",
	LOW: "levelLow",
	MEDIUM: "levelMedium",
	HIGH: "levelHigh",
	VERY_HIGH: "levelVeryHigh",
};

export default class extends Command {
	constructor(client: BulbBotClient, name: string) {
		super(client, {
			name,
			description: "Changes the server verification level",
			category: "Moderation",
			clearance: 75,
			userPerms: ["MANAGE_GUILD"],
			clientPerms: ["MANAGE_GUILD"],
		});
	}

	public async run(context: CommandContext, _args: string[]): Promise<void | Message> {
		let selected: string = verificationLevel[context.guild?.verificationLevel || "NONE"];
		let done = false;
		let content: string = await this.client.bulbutils.translate("verification_level_select", context.guild?.id, {});

		let mainrow = new MessageActionRow().addComponents([
			new MessageButton()
				.setStyle(selected === "levelNone" ? "PRIMARY" : "SECONDARY")
				.setLabel("None")
				.setCustomId("levelNone")
				.setDisabled(context.guild?.features.includes("COMMUNITY")),
			new MessageButton()
				.setStyle(selected === "levelLow" ? "PRIMARY" : "SECONDARY")
				.setLabel("Low")
				.setCustomId("levelLow"),
			new MessageButton()
				.setStyle(selected === "levelMedium" ? "PRIMARY" : "SECONDARY")
				.setLabel("Medium")
				.setCustomId("levelMedium"),
			new MessageButton()
				.setStyle(selected === "levelHigh" ? "PRIMARY" : "SECONDARY")
				.setLabel("High")
				.setCustomId("levelHigh"),
			new MessageButton()
				.setStyle(selected === "levelVeryHigh" ? "PRIMARY" : "SECONDARY")
				.setLabel("Very High")
				.setCustomId("levelVeryHigh"),
		]);
		let saverow = new MessageActionRow().addComponents([new MessageButton().setStyle("SUCCESS").setLabel("Save").setCustomId("verificationSave")]);

		const message = await context.channel.send({
			content,
			components: [mainrow, saverow],
		});

		const collector = message.createMessageComponentCollector({ time: 30000 });

		collector.on("collect", async (interaction: ButtonInteraction) => {
			if (interaction.user.id !== context.author.id)
				return interaction.reply({
					ephemeral: true,
					content: await this.client.bulbutils.translate("global_not_invoked_by_user", context.guild?.id, {}),
				});

			if (interaction.customId !== "verificationSave") selected = interaction.customId;
			else {
				done = true;
				await context.guild?.setVerificationLevel(levels[selected]);
				content = await this.client.bulbutils.translate("verification_level_success", context.guild?.id, { level: levels[selected] });
			}

			mainrow = new MessageActionRow().addComponents([
				new MessageButton()
					.setStyle(selected === "levelNone" ? "PRIMARY" : "SECONDARY")
					.setLabel("None")
					.setCustomId("levelNone")
					.setDisabled(context.guild?.features.includes("COMMUNITY") || done),
				new MessageButton()
					.setStyle(selected === "levelLow" ? "PRIMARY" : "SECONDARY")
					.setLabel("Low")
					.setCustomId("levelLow")
					.setDisabled(done),
				new MessageButton()
					.setStyle(selected === "levelMedium" ? "PRIMARY" : "SECONDARY")
					.setLabel("Medium")
					.setCustomId("levelMedium")
					.setDisabled(done),
				new MessageButton()
					.setStyle(selected === "levelHigh" ? "PRIMARY" : "SECONDARY")
					.setLabel("High")
					.setCustomId("levelHigh")
					.setDisabled(done),
				new MessageButton()
					.setStyle(selected === "levelVeryHigh" ? "PRIMARY" : "SECONDARY")
					.setLabel("Very High")
					.setCustomId("levelVeryHigh")
					.setDisabled(done),
			]);

			saverow = new MessageActionRow().addComponents([new MessageButton().setStyle("SUCCESS").setLabel("Save").setCustomId("verificationSave").setDisabled(done)]);

			interaction.deferUpdate();

			message.edit({
				content,
				components: [mainrow, saverow],
			});
		});
	}
}
