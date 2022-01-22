import Command from "../../structures/Command";
import CommandContext from "../../structures/CommandContext";
import { ButtonInteraction, Message, MessageActionRow, MessageButton } from "discord.js";
import { NonDigits, RoleMentionAndID } from "../../utils/Regex";
import BulbBotClient from "../../structures/BulbBotClient";
import LoggingManager from "../../utils/managers/LoggingManager";

const { sendModActionPreformatted }: LoggingManager = new LoggingManager();

export default class extends Command {
	constructor(client: BulbBotClient, name: string) {
		super(client, {
			name,
			description: "Prune users from the server",
			category: "Moderation",
			usage: "<days> [roles]... [reason]",
			argList: ["days:Number"],
			examples: ["prune 5", "prune 1 @members @sleepers", "prune 2 @members kicking after being afk for 2 days"],
			minArgs: 1,
			maxArgs: -1,
			clearance: 50,
			clientPerms: ["KICK_MEMBERS"],
		});
	}

	public async run(context: CommandContext, args: string[]): Promise<void | Message> {
		const days = parseInt(args[0]);
		if (isNaN(days) || days <= 0 || days > 30) return context.channel.send(await this.client.bulbutils.translate("prune_invalid_time", context.guild?.id, {}));
		let roles: RegExpMatchArray = <RegExpMatchArray>args.slice(1).join(" ").match(RoleMentionAndID);
		if (roles === null) roles = [];
		else roles = roles.map(r => r.replace(NonDigits, ""));

		let reason: string = args
			.slice(roles.length + 1)
			.join(" ")
			.replace(RoleMentionAndID, "");

		if (reason === "") reason = await this.client.bulbutils.translate("global_no_reason", context.guild?.id, {});

		const prunesize = await context.guild?.members.prune({
			days,
			roles,
			dry: true,
		});

		if (prunesize === 0) return context.channel.send(await this.client.bulbutils.translate("prune_no_users", context.guild?.id, {}));

		const row = new MessageActionRow().addComponents([
			new MessageButton().setStyle("SUCCESS").setLabel("Confirm").setCustomId("confirm"),
			new MessageButton().setStyle("DANGER").setLabel("Cancel").setCustomId("cancel"),
		]);

		const confirmMsg = await context.channel.send({
			content: await this.client.bulbutils.translate("prune_confirm_prune", context.guild?.id, { prunesize }),
			components: [row],
		});

		const collector = confirmMsg.createMessageComponentCollector({ time: 30000 });

		collector.on("collect", async (interaction: ButtonInteraction) => {
			if (interaction.user.id !== context.author.id) {
				return interaction.reply({ content: await this.client.bulbutils.translate("global_not_invoked_by_user", context.guild?.id, {}), ephemeral: true });
			}

			if (interaction.customId === "confirm") {
				const prune = await context.guild?.members.prune({
					days,
					roles,
					count: true,
					reason,
					dry: false,
				});

				confirmMsg.edit({
					components: [],
					content: await this.client.bulbutils.translate("prune_successful", context.guild?.id, { prune }),
				});
				await sendModActionPreformatted(
					this.client,
					context.guild!,
					await this.client.bulbutils.translate("prune_log", context.guild?.id, {
						user: context.author,
						prune,
						reason,
						days,
						roles: roles.map(r => `<@&${r}>`).join(" "),
					}),
				);

				collector.stop("clicked");
			} else {
				collector.stop("clicked");
				return interaction.update({ content: await this.client.bulbutils.translate("global_execution_cancel", context.guild?.id, {}), components: [] });
			}
		});

		collector.on("end", async (_: ButtonInteraction, reason: string) => {
			if (reason !== "time") return;

			await confirmMsg.edit({ content: await this.client.bulbutils.translate("global_execution_cancel", context.guild?.id, {}), components: [] });
			return;
		});
	}
}
