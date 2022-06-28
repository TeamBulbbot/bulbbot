import Event from "../../structures/Event";
import { Guild, Interaction } from "discord.js";
import warn from "../../interactions/context/warn";
import infSearch from "../../interactions/context/infSearch";
import mute from "../../interactions/context/mute";
import infraction from "../../interactions/select/infraction";
import clean from "../../interactions/context/clean";
import { getCommandContext } from "../../structures/CommandContext";
import reminders from "../../interactions/select/reminders";
import DatabaseManager from "../../utils/managers/DatabaseManager";

const databaseManager: DatabaseManager = new DatabaseManager();

export default class extends Event {
	constructor(...args: any[]) {
		// @ts-expect-error
		super(...args, {
			once: true,
		});
	}

	async run(interaction: Interaction): Promise<void> {
		if (interaction.isCommand() && !interaction.inGuild()) {
			await interaction.reply({
				content: await this.client.bulbutils.translate("event_interaction_dm_command", "742094927403679816", {}),
				ephemeral: true,
			});
			return;
		}

		const context = await getCommandContext(interaction);
		if (!context.guild) return;
		if (this.client.blacklist.get(context.guild.id)) return;
		context.prefix = (await databaseManager.getConfig(context.guild)).prefix;

		if (interaction.isSelectMenu()) {
			if (interaction.customId === "infraction") await infraction(this.client, interaction);
			else if (interaction.customId === "reminders") await reminders(this.client, interaction);
		} else if (interaction.isContextMenu()) {
			const channel = this.client.guilds.cache.get(context.guild.id)?.channels.cache.get(context.channelId);
			const message = channel?.isText() && (await channel.messages.fetch(interaction.targetId));

			if (
				!message ||
				!interaction.guild ||
				(await this.client.bulbutils.resolveUserHandleFromInteraction(
					interaction,
					await this.client.bulbutils.checkUserFromInteraction(interaction, await interaction.guild.members.fetch(message.author.id)),
					message.author,
				))
			)
				return;

			//Context commands
			if (context.commandName === "List all Infractions") await infSearch(this.client, interaction, message);
			else if (context.commandName === "Warn") await warn(this.client, interaction, message);
			else if (context.commandName === "Quick Mute (1h)") await mute(this.client, interaction, message);
			else if (context.commandName === "Clean All Messages") await clean(this.client, interaction, message);
		} else if (interaction.isCommand()) {
			// Slash commands
			const command = context.commandName && this.client.commands.get(context.commandName);

			if (!command) {
				// Shouldn't be possible because we shouldn't register commands that we aren't prepared
				// to handle, but we need to narrow the type properly regardless. It is technically plausible
				return;
			}

			const missing = command.validateClientPermissions(interaction);
			const { premiumGuild } = await databaseManager.getConfig(interaction.guild as Guild);

			if (!premiumGuild && command.premium)
				return interaction.reply({
					content: await this.client.bulbutils.translate("global_premium_only", interaction.guild?.id, {}),
					ephemeral: true,
				});

			if (missing)
				return interaction.reply({
					content: await this.client.bulbutils.translate("global_missing_permissions_bot", interaction.guild?.id, { missing }),
					ephemeral: true,
				});

			// Should we add a .catch to handle uncaught errors thrown in command run methods?
			await command.run(interaction);
		}
	}
}
