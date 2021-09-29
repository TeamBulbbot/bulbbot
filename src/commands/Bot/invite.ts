import Command from "../../structures/Command";
import CommandContext from "../../structures/CommandContext";
import { MessageActionRow, MessageButton } from "discord.js";
import * as Config from "../../Config";
import BulbBotClient from "../../structures/BulbBotClient";
import { NonDigits } from "../../utils/Regex";
import * as Emotes from "../../emotes.json";
export default class extends Command {
	constructor(client: BulbBotClient, name: string) {
		super(client, {
			name,
			description: "Returns the invite link for the bot and the support guild",
			category: "Bot",
			aliases: ["support"],
			clientPerms: ["EMBED_LINKS"],
		});
	}

	async run(context: CommandContext): Promise<void> {
		const row = new MessageActionRow().addComponents([
			new MessageButton().setLabel("Invite").setStyle("LINK").setEmoji(Emotes.other.DISCORD.replace(NonDigits, "")).setURL(Config.botInvite),
			new MessageButton().setLabel("Support").setStyle("LINK").setEmoji(Emotes.other.SUPPORT.replace(NonDigits, "")).setURL(Config.supportInvite),
		]);

		await context.channel.send({ content: await this.client.bulbutils.translate("invite_content", context.guild?.id, {}), components: [row] });
	}
}
