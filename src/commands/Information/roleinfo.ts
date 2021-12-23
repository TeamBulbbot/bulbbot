import Command from "../../structures/Command";
import CommandContext from "../../structures/CommandContext";
import BulbBotClient from "../../structures/BulbBotClient";
import { NonDigits } from "../../utils/Regex";
import { MessageEmbed, Role } from "discord.js";

export default class extends Command {
	constructor(client: BulbBotClient, name: string) {
		super(client, {
			name,
			description: "Returns some useful info about a role",
			category: "Information",
			usage: "<role>",
			examples: ["roleinfo 868832624502771723", "roleinfo @Bulbbot"],
			clearance: 50,
			maxArgs: 1,
			minArgs: 1,
			argList: ["role:Role"],
			clientPerms: ["EMBED_LINKS"],
		});
	}

	async run(context: CommandContext, args: string[]): Promise<void> {
		const roleId: string = args[0].replace(NonDigits, "");
		const role: Role | undefined = context.guild?.roles.cache.get(roleId);
		if (!role) {
			context.channel.send(
				await this.client.bulbutils.translate("global_not_found", context.guild?.id, {
					type: await this.client.bulbutils.translate("global_not_found_types.role", context.guild?.id, {}),
					arg_expected: "role:Role",
					arg_provided: args[0],
					usage: this.usage,
				}),
			);
			return;
		}
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
				.map(p => `\`${p}\``)
				.join(" ")}`,
		];

		const embed = new MessageEmbed()
			.setColor(role.color)
			.setDescription(desc.join("\n"))
			.setFooter(
				await this.client.bulbutils.translate("global_executed_by", context.guild?.id, {
					user: context.author,
				}),
				<string>context.author.avatarURL({ dynamic: true }),
			)
			.setTimestamp();

		context.channel.send({ embeds: [embed] });
	}
}
