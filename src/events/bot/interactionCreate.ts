import Event from "../../structures/Event";
import { GuildMember, Interaction, Message, Snowflake, TextChannel } from "discord.js";
import ClearanceManager from "../../utils/managers/ClearanceManager";
import warn from "../../interactions/context/warn";
import infSearch from "../../interactions/context/infSearch";
import mute from "../../interactions/context/mute";
import infraction from "../../interactions/select/infraction";
import clean from "../../interactions/context/clean";
import { getCommandContext } from "../../structures/CommandContext";
import Command from "../../structures/Command";
import reminders from "../../interactions/select/reminders";
import LoggingManager from "../../utils/managers/LoggingManager";
import DatabaseManager from "../../utils/managers/DatabaseManager";
import { commandUsage } from "../../utils/Prometheus";

const clearanceManager: ClearanceManager = new ClearanceManager();
const loggingManager: LoggingManager = new LoggingManager();
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
		if (this.client.blacklist.get(context.author.id) !== undefined) return;
		if (!context.guild) return;
		if (this.client.blacklist.get(context.guild.id)) return;
		if (context.guildId !== null) context.prefix = (await databaseManager.getConfig(context.guildId)).prefix;

		if (interaction.isSelectMenu()) {
			if (interaction.customId === "infraction") await infraction(this.client, interaction);
			else if (interaction.customId === "reminders") await reminders(this.client, interaction);
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
			if (context.commandName === "List all Infractions") await infSearch(this.client, interaction, message);
			else if (context.commandName === "Warn") await warn(this.client, interaction, message);
			else if (context.commandName === "Quick Mute (1h)") await mute(this.client, interaction, message);
			else if (context.commandName === "Clean All Messages") await clean(this.client, interaction, message);
		} else if (interaction.isCommand()) {
			const subCommandGroup: string = <string>context.options.getSubcommandGroup(false);
			const subCommand: string = <string>context.options.getSubcommand(false);
			const args: string[] = [];
			let cmd: string = <string>context.commandName;

			if (subCommandGroup && subCommand) cmd += ` ${subCommandGroup} ${subCommand}`;
			else if (!subCommandGroup && subCommand) cmd += ` ${subCommand}`;

			for (const option of context.options["_hoistedOptions"]) {
				if (option.type === "STRING") args.push(...`${option.value}`.split(" "));
				else args.push(`${option.value}`);
			}

			const command = Command.resolve(this.client, cmd);
			if (!command) return;
			const invalidReason = await command.validate(context, args);
			if (invalidReason !== undefined) {
				if (invalidReason) await context.reply({ content: invalidReason, ephemeral: true });
				return;
			}

			let used = `/${command.qualifiedName}`;
			args.forEach(arg => (used += ` ${arg}`));
			await loggingManager.sendCommandLog(this.client, interaction.guild!, context.author, context.channel.id, used);

			await context.deferReply();
			await command.run(context, args);
			commandUsage(context, command, true);
		}
	}
}
