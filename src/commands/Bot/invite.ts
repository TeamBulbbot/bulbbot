import { CommandInteraction, MessageActionRow, MessageButton } from "discord.js";
import * as Config from "../../Config";
import BulbBotClient from "../../structures/BulbBotClient";
import { NonDigits } from "../../utils/Regex";
import * as Emotes from "../../emotes.json";
import ApplicationCommand from "../../structures/ApplicationCommand";
import { ApplicationCommandType } from "../../utils/types/ApplicationCommands";

export default class extends ApplicationCommand {
	constructor(client: BulbBotClient, name: string) {
		super(client, {
			name,
			description: "Returns the invite link for the bot and the support server",
			type: ApplicationCommandType.CHAT_INPUT,
		});
	}

	public async run(interaction: CommandInteraction): Promise<void> {
		const row = new MessageActionRow().addComponents([
			new MessageButton().setLabel("Invite").setStyle("LINK").setEmoji(Emotes.other.DISCORD.replace(NonDigits, "")).setURL(Config.botInvite),
			new MessageButton().setLabel("Support").setStyle("LINK").setEmoji(Emotes.other.SUPPORT.replace(NonDigits, "")).setURL(Config.supportInvite),
		]);

		await interaction.reply({ content: await this.client.bulbutils.translate("invite_content", interaction.guild?.id, {}), components: [row] });
	}
}
