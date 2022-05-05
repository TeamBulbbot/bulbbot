import Command from "../../../structures/Command";
import SubCommand from "../../../structures/SubCommand";
import CommandContext from "../../../structures/CommandContext";
import { ButtonInteraction, Message, MessageActionRow, MessageButton } from "discord.js";
import BulbBotClient from "../../../structures/BulbBotClient";
import BanpoolManager from "../../../utils/managers/BanpoolManager";
import LoggingManager from "../../../utils/managers/LoggingManager";

const { sendEventLog }: LoggingManager = new LoggingManager();
const { haveAccessToPool, hasBanpoolLog }: BanpoolManager = new BanpoolManager();

export default class extends SubCommand {
	constructor(client: BulbBotClient, parent: Command) {
		super(client, parent, {
			name: "invite",
			aliases: ["inv"],
			minArgs: 1,
			maxArgs: -1,
			argList: ["pool-name:String"],
			usage: "<pool-name>",
			clearance: 100,
			description: "Generates an invite code for the specified ban pool.",
		});
	}

	public async run(context: CommandContext, args: string[]): Promise<void | Message> {
		const name: string = args[0];

		if (!(context.guild?.id && (await hasBanpoolLog(context.guild.id)))) return context.channel.send(await this.client.bulbutils.translate("banpool_missing_logging", context.guild?.id, {}));
		if (!(await haveAccessToPool(context.guild.id, name))) return context.channel.send(await this.client.bulbutils.translate("banpool_missing_access_not_found", context.guild.id, {}));

		const filter = (i: any) => i.user.id === context.author.id;

		const row = new MessageActionRow().addComponents([new MessageButton().setCustomId("generate-ban-pool-code").setLabel("Generate code").setStyle("SUCCESS")]);
		const rowDisabled = new MessageActionRow().addComponents([new MessageButton().setCustomId("generate-ban-pool-code").setLabel("Generate code").setStyle("SUCCESS").setDisabled(true)]);

		const msg: Message = await context.channel.send({
			content: await this.client.bulbutils.translate("banpool_invite_message", context.guild.id, {}),
			components: [row],
		});

		const collector = msg.createMessageComponentCollector({ filter, time: 15000 });

		collector.on("collect", async (interaction: ButtonInteraction) => {
			if (!interaction) return;
			const code: string = createInviteCode();

			this.client.banpoolInvites.set(code, {
				guild: {
					id: context.guild?.id,
					name: context.guild?.name,
				},
				inviter: {
					tag: context.author.tag,
					id: context.author.id,
				},
				banpool: {
					name,
					code,
					expires: Math.floor(Date.now() / 1000) + 15 * 60,
				},
			});

			await sendEventLog(
				this.client,
				context.guild,
				"banpool",
				await this.client.bulbutils.translate("banpool_invite_success_log", context.guild?.id, {
					user: context.user,
					name,
					expireTime: Math.floor(Date.now() / 1000 + 15 * 60),
				}),
			);

			setTimeout(() => {
				this.client.banpoolInvites.delete(code);
			}, 15 * 60 * 1000);

			await msg.edit({ components: [rowDisabled] });

			interaction.reply({
				ephemeral: true,
				content: await this.client.bulbutils.translate("banpool_invite_reply", context.guild?.id, {
					code,
					name,
					expireTime: Math.floor(Date.now() / 1000 + 15 * 60),
				}),
			});
		});

		collector.on("end", async () => {
			await msg.edit({ components: [rowDisabled] });
		});
	}
}

function createInviteCode(): string {
	const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	let res = "";

	for (let _ = 0; _ < 10; _++) res += chars[Math.floor(Math.random() * chars.length)];

	return res;
}
