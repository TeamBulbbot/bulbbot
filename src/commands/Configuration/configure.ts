import Command from "../../structures/Command";
import BulbBotClient from "../../structures/BulbBotClient";
import CommandContext from "../../structures/CommandContext";
import { Message, MessageActionRow, MessageComponentInteraction, MessageSelectMenu } from "discord.js";
import * as Emotes from "../../emotes.json";

export default class extends Command {
	constructor(client: BulbBotClient, name: string) {
		super(client, {
			name,
			description: "Configure the bot in your server",
			category: "Configuration",
			aliases: ["cfg", "conf", "config", "setting"],
			usage: "<setting>",
			examples: ["configure prefix <prefix>", "configure logging mod_action <channel>"],
			maxArgs: -1,
			clearance: 75,
			userPerms: ["MANAGE_GUILD"],
		});
	}

	public async run(context: CommandContext): Promise<void | Message> {
		if (!context.guild) return;

		const row = new MessageActionRow().addComponents(
			new MessageSelectMenu()
				.setCustomId("configure-main")
				.setPlaceholder(await this.client.bulbutils.translate("config_main_placeholder", context.guild?.id, {}))
				.addOptions([
					{
						label: await this.client.bulbutils.translate("config_main_options.actions_on_info", context.guild?.id, {}),
						value: "actionsOnInfo",
						description: await this.client.bulbutils.translate("config_main_options_descriptions.actions_on_info", context.guild?.id, {}),
						emoji: Emotes.configure.ACTIONS_ON_INFO,
					},
					{
						label: await this.client.bulbutils.translate("config_main_options.automod", context.guild?.id, {}),
						value: "automod",
						description: await this.client.bulbutils.translate("config_main_options_descriptions.automod", context.guild?.id, {}),
						emoji: Emotes.configure.AUTOMOD,
					},
					{
						label: await this.client.bulbutils.translate("config_main_options.autorole", context.guild?.id, {}),
						value: "autorole",
						description: await this.client.bulbutils.translate("config_main_options_descriptions.autorole", context.guild?.id, {}),
						emoji: Emotes.configure.AUTOROLE,
					},
					{
						label: await this.client.bulbutils.translate("config_main_options.language", context.guild?.id, {}),
						value: "language",
						emoji: Emotes.configure.LANGUAGE,
						description: await this.client.bulbutils.translate("config_main_options_descriptions.language", context.guild?.id, {}),
					},
					{
						label: await this.client.bulbutils.translate("config_main_options.logging", context.guild?.id, {}),
						value: "logging",
						description: await this.client.bulbutils.translate("config_main_options_descriptions.logging", context.guild?.id, {}),
						emoji: Emotes.configure.LOGGING,
					},
					{
						label: await this.client.bulbutils.translate("config_main_options.prefix", context.guild?.id, {}),
						value: "prefix",
						description: await this.client.bulbutils.translate("config_main_options_descriptions.prefix", context.guild?.id, {}),
						emoji: Emotes.features.MEMBER_LIST_DISABLED,
					},
					{
						label: await this.client.bulbutils.translate("config_main_options.quick_reasons", context.guild?.id, {}),
						value: "quickReasons",
						description: await this.client.bulbutils.translate("config_main_options_descriptions.quick_reasons", context.guild?.id, {}),
						emoji: Emotes.features.MEMBER_PROFILES,
					},
					{
						label: await this.client.bulbutils.translate("config_main_options.roles_on_leave", context.guild?.id, {}),
						value: "rolesOnLeave",
						description: await this.client.bulbutils.translate("config_main_options_descriptions.roles_on_leave", context.guild?.id, {}),
						emoji: Emotes.features.HUB,
					},
					{
						label: await this.client.bulbutils.translate("config_main_options.timezone", context.guild?.id, {}),
						value: "timezone",
						description: await this.client.bulbutils.translate("config_main_options_descriptions.timezone", context.guild?.id, {}),
						emoji: Emotes.configure.TIMEZONE,
					},
				]),
		);

		await context.channel.send({
			content: await this.client.bulbutils.translate("config_main_header", context.guild?.id, {
				guild: context.guild,
			}),
			components: [row],
		});

		const filter = (i: MessageComponentInteraction) => i.user.id === context.user.id;
		const collector = context.channel.createMessageComponentCollector({ filter, time: 60000, max: 1 });

		collector.on("collect", async (i: MessageComponentInteraction) => {
			if (i.isSelectMenu()) {
				await require(`./configure/${i.values[0]}`).default(i, this.client);
			}
		});
	}
}
