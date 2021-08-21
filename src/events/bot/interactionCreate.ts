import Event from "../../structures/Event";
import { GuildMember, Interaction, Message, Snowflake, TextChannel } from "discord.js";
import ClearanceManager from "../../utils/managers/ClearanceManager";
import warn from "../../interactions/context/warn";
import kick from "../../interactions/context/kick";
import ban from "../../interactions/context/ban";
import mute from "../../interactions/context/mute";
import infraction from "../../interactions/select/infraction";
import clean from "../../interactions/context/clean";
import { getCommandContext } from "../../structures/CommandContext";
import Command from "../../structures/Command";

const clearanceManager: ClearanceManager = new ClearanceManager();

export default class extends Event {
	constructor(...args: any[]) {
		// @ts-ignore
		super(...args, {
			once: true,
		});
	}

	async run(interaction: Interaction): Promise<void> {
		const context = getCommandContext(interaction);
		if (interaction.isSelectMenu()) {
			if (interaction.customId !== "infraction") return;
			await infraction(this.client, interaction);
		} else if (interaction.isContextMenu()) {
			if ((await clearanceManager.getUserClearance(context)) < 50)
				return void (await context.reply({ content: await this.client.bulbutils.translate("global_missing_permissions", interaction.guild?.id, {}), ephemeral: true }));
			const message: Message = <Message>await (<TextChannel>this.client.guilds.cache.get(<Snowflake>context.guildId)?.channels.cache.get(context.channelId)).messages.fetch(interaction.targetId);

			if (
				await this.client.bulbutils.resolveUserHandleFromInteraction(
					interaction,
					await this.client.bulbutils.checkUserFromInteraction(interaction, <GuildMember>await interaction.guild?.members.fetch(message.author.id)),
					message.author,
				)
			)
				return;

			//Context commands
			if (interaction.commandName === "Ban") await ban(this.client, interaction, message);
			else if (interaction.commandName === "Kick") await kick(this.client, interaction, message);
			else if (interaction.commandName === "Warn") await warn(this.client, interaction, message);
			else if (interaction.commandName === "Quick Mute (1h)") await mute(this.client, interaction, message);
			else if (interaction.commandName === "Clean All Messages") await clean(this.client, interaction, message);
		} else if (interaction.isCommand()) {
			if (interaction.commandName === "ping") {
				await interaction.deferReply()
				Command.resolve(this.client, "ping")?.run(context, []);
			} else if (interaction.commandName === "warn") {
				await interaction.deferReply();
				Command.resolve(this.client, "warn")?.run(context, [<string>interaction.options.data[0].value])
			}
		}
	}
}
