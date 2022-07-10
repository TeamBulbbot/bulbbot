import ApplicationCommand from "../../structures/ApplicationCommand";
import BulbBotClient from "../../structures/BulbBotClient";
import { ApplicationCommandType } from "discord-api-types/v10";
import { ContextMenuInteraction, Guild, GuildMember, MessageActionRow, MessageSelectMenu, MessageSelectOptionData, SelectMenuInteraction } from "discord.js";
import moment from "moment";
import DatabaseManager from "../../utils/managers/DatabaseManager";
import InfractionsManager from "../../utils/managers/InfractionsManager";

const databaseManager: DatabaseManager = new DatabaseManager();
const infractionsManager: InfractionsManager = new InfractionsManager();

export default class extends ApplicationCommand {
	constructor(client: BulbBotClient) {
		super(client, {
			name: "Quick Mute (1h)",
			type: ApplicationCommandType.User,
			description: "",
			options: null,
			command_permissions: ["MODERATE_MEMBERS"],
		});
	}

	public async run(interaction: ContextMenuInteraction): Promise<void> {
		const target = (await this.client.bulbfetch.getGuildMember(interaction.guild?.members, interaction.targetId)) as GuildMember;

		const timezone = this.client.bulbutils.timezones[(await databaseManager.getConfig(interaction.guild as Guild)).timezone];
		const reason = await this.client.bulbutils.translate("global_no_reason", interaction.guild?.id, {});

		const reasons: string[] = (await databaseManager.getConfig(interaction.guild as Guild)).quickReasons;
		reasons.push(await this.client.bulbutils.translate("global_no_reason", interaction.guild?.id, {}));

		const options: MessageSelectOptionData[] = [];
		for (const reason of reasons) {
			options.push({ label: reason, value: reason });
		}

		const row: MessageActionRow = new MessageActionRow().addComponents(new MessageSelectMenu().setPlaceholder("Select a reason").setCustomId("warn").addOptions(options));

		await interaction.reply({
			content: await this.client.bulbutils.translate("userinfo_interaction_confirm", interaction.guild?.id, {
				target: target.user,
				action: await this.client.bulbutils.translate("mod_action_types.mute", interaction.guild?.id, {}),
			}),
			components: [row],
			ephemeral: true,
		});

		const collector = interaction.channel?.createMessageComponentCollector({ componentType: "SELECT_MENU", time: 30000 });

		collector?.on("collect", async (i: SelectMenuInteraction) => {
			const infID = await infractionsManager.mute(
				this.client,
				interaction.guild as Guild,
				target,
				interaction.member as GuildMember,
				await this.client.bulbutils.translate("global_mod_action_log", interaction.guild?.id, {
					action: await this.client.bulbutils.translate("mod_action_types.mute", interaction.guild?.id, {}),
					moderator: interaction.user,
					target: target.user,
					reason,
				}),
				reason,
				Date.now() + 3600000,
			);

			await i.update({
				content: await this.client.bulbutils.translate("action_success_temp", interaction.guild?.id, {
					action: await this.client.bulbutils.translate("mod_action_types.mute", interaction.guild?.id, {}),
					target: target.user,
					reason,
					infraction_id: infID,
					until: moment(Date.now() + 3600000)
						.tz(timezone)
						.format("MMM Do YYYY, h:mm:ssa z"),
				}),
				components: [],
			});

			collector.stop();
		});
	}
}
