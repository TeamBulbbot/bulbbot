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
import reminders from "../../interactions/select/reminders";

const clearanceManager: ClearanceManager = new ClearanceManager();

export default class extends Event {
	constructor(...args: any[]) {
		// @ts-ignore
		super(...args, {
			once: true,
		});
	}

	async run(interaction: Interaction): Promise<void> {
		const context = await getCommandContext(interaction);

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
			if (context.commandName === "Ban") await ban(this.client, interaction, message);
			else if (context.commandName === "Kick") await kick(this.client, interaction, message);
			else if (context.commandName === "Warn") await warn(this.client, interaction, message);
			else if (context.commandName === "Quick Mute (1h)") await mute(this.client, interaction, message);
			else if (context.commandName === "Clean All Messages") await clean(this.client, interaction, message);
		} else if (interaction.isCommand()) {
			if (context.channel.type === "DM") {
				await context.reply({
					content: await this.client.bulbutils.translate("event_interaction_dm_command", context.guild?.id, {}),
					ephemeral: true
				})
				return;
			}

			const subCommandGroup: string = <string>context.options.getSubcommandGroup(false);
			const subCommand: string = <string>context.options.getSubcommand(false);
			let args: string[] = [];
			let cmd: string = <string>context.commandName;

			if (subCommandGroup && subCommand) cmd += ` ${subCommandGroup} ${subCommand}`;
			else if (!subCommandGroup && subCommand) cmd += ` ${subCommand}`;

			for (const option of context.options["_hoistedOptions"]) {
				if (option.type === "STRING") args.push(...(`${option.value}`.split(" ")));
				else args.push(`${option.value}`);
			}

			const command = Command.resolve(this.client, cmd);
			if (!command) return;
			const invalidReason = await command.validate(context, args);
			if (invalidReason !== undefined) {
				if (invalidReason) await context.reply({ content: invalidReason, ephemeral: true });
				return;
			}

			await context.deferReply();
			await command.run(context, args);
		}
	}
}
