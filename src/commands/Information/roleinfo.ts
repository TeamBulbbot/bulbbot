import BulbBotClient from "../../structures/BulbBotClient";
import { CommandInteraction, MessageEmbed, Role } from "discord.js";
import ApplicationCommand from "../../structures/ApplicationCommand";
import { APIRole, ApplicationCommandOptionType, ApplicationCommandType } from "discord-api-types/v9";
import { resolveGuildRoleMoreSafe } from "../../utils/helpers";

export default class RoleInfo extends ApplicationCommand {
	constructor(client: BulbBotClient, name: string) {
		super(client, {
			name,
			type: ApplicationCommandType.ChatInput,
			description: "Returns some useful info about a role",
			options: [
				{
					name: "role",
					type: ApplicationCommandOptionType.Role,
					description: "The role you want more info about",
					required: true,
				},
			],
			command_permissions: ["MANAGE_ROLES"],
			client_permissions: ["EMBED_LINKS"],
		});
	}

	public async run(interaction: CommandInteraction) {
		const role = resolveGuildRoleMoreSafe(interaction.options.getRole("role") as Role | APIRole);

		const tags: string[] = [`(by `];
		if (role.managed) {
			role.tags?.botId ? tags.push(`<@${role.tags.botId}> \`${role.tags.botId}\``) : null;
			role.tags?.integrationId ? tags.push(`\`${role.tags.integrationId}\``) : null;
			role.tags?.premiumSubscriberRole ? tags.push(`\`server boosting\``) : null;
			tags.push(")");
		}

		const desc: string[] = [
			`**ID:** ${role.id}`,
			`**Name:** ${role.name}`,
			`**Mention:** <@&${role.id}>`,
			`**Color:** #${role.color.toString(16)}`,
			`**Hoisted:** ${role.hoist}`,
			`**Raw Position:** ${role.rawPosition}`,
			`**Managed:** ${role.managed} ${role.managed ? tags.join(" ") : ""}`,
			`**Mentionable:** ${role.mentionable}`,
			`\n**Permissions:** ${role.permissions
				.toArray()
				.map((p) => `\`${p}\``)
				.join(" ")}`,
		];

		const embed = new MessageEmbed()
			.setColor(role.color)
			.setDescription(desc.join("\n"))
			.setFooter({
				text: await this.client.bulbutils.translate("global_executed_by", interaction.guild?.id, {
					user: interaction.user,
				}),
				iconURL: interaction.user.avatarURL({ dynamic: true }) || "",
			})
			.setTimestamp();

		return interaction.reply({ embeds: [embed] });
	}
}
