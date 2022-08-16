import ApplicationCommand from "../../structures/ApplicationCommand";
import BulbBotClient from "../../structures/BulbBotClient";
import { ApplicationCommandType } from "discord-api-types/v10";
import { ContextMenuInteraction, Guild, GuildMember, Interaction, MessageActionRow, MessageSelectMenu, MessageSelectOptionData, SelectMenuInteraction, User } from "discord.js";
import DatabaseManager from "../../utils/managers/DatabaseManager";
import InfractionsManager from "../../utils/managers/InfractionsManager";

const databaseManager: DatabaseManager = new DatabaseManager();
const infractionsManager: InfractionsManager = new InfractionsManager();

export default class ContextWarn extends ApplicationCommand {
	constructor(client: BulbBotClient) {
		super(client, {
			name: "Warn",
			type: ApplicationCommandType.User,
			description: "",
			options: null,
			command_permissions: ["MODERATE_MEMBERS"],
		});
	}

	public async run(interaction: ContextMenuInteraction): Promise<void> {
		const target = (await this.client.bulbfetch.getUser(interaction.targetId)) as User;

		const reasons: string[] = (await databaseManager.getConfig(interaction.guild as Guild)).quickReasons;
		reasons.push(await this.client.bulbutils.translate("global_no_reason", interaction.guild?.id, {}));

		const options: MessageSelectOptionData[] = [];
		for (const reason of reasons) {
			options.push({ label: reason, value: reason });
		}

		const row: MessageActionRow = new MessageActionRow().addComponents(new MessageSelectMenu().setPlaceholder("Select a reason").setCustomId("warn").addOptions(options));

		await interaction.reply({
			content: await this.client.bulbutils.translate("userinfo_interaction_confirm", interaction.guild?.id, {
				target: target,
				action: await this.client.bulbutils.translate("mod_action_types.warn", interaction.guild?.id, {}),
			}),
			components: [row],
			ephemeral: true,
		});

		const filter = (i: Interaction) => interaction.user.id === i.user.id;
		const collector = interaction.channel?.createMessageComponentCollector({ filter, max: 1, componentType: "SELECT_MENU", time: 30_000 });

		collector?.on("collect", async (i: SelectMenuInteraction) => {
			const infID = await infractionsManager.warn(
				this.client,
				interaction.guild as Guild,
				target,
				interaction.member as GuildMember,
				await this.client.bulbutils.translate("global_mod_action_log", interaction.guild?.id, {
					action: await this.client.bulbutils.translate("mod_action_types.warn", interaction.guild?.id, {}),
					moderator: interaction.user,
					target,
					reason: i.values[0],
				}),
				i.values[0],
			);

			await i.update({
				content: await this.client.bulbutils.translate("action_success", interaction.guild?.id, {
					action: await this.client.bulbutils.translate("mod_action_types.warn", interaction.guild?.id, {}),
					target,
					reason: i.values[0],
					infraction_id: infID,
				}),
				components: [],
			});

			collector.stop();
		});
	}
}
