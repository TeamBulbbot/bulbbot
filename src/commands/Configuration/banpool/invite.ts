import Command from "../../../structures/Command";
import SubCommand from "../../../structures/SubCommand";
import CommandContext from "../../../structures/CommandContext";
import { ButtonInteraction, Message, MessageActionRow, MessageButton } from "discord.js";
import BulbBotClient from "../../../structures/BulbBotClient";
import BanpoolManager from "../../../utils/managers/BanpoolManager";
const { haveAccessToPool }: BanpoolManager = new BanpoolManager();

export default class extends SubCommand {
	constructor(client: BulbBotClient, parent: Command) {
		super(client, parent, {
			name: "invite",
			minArgs: 1,
			maxArgs: -1,
			argList: ["poolName:string"],
			usage: "<poolName>",
			clearance: 100,
		});
	}

	public async run(context: CommandContext, args: string[]): Promise<void | Message> {
		// todo log in banpool logs that an invite was created

		const name: string = args[0];

		if (await haveAccessToPool(context.guild!?.id, name)) return context.channel.send("well can't access that my friend");

		const filter = (i: any) => i.user.id === context.author.id;

		const row = new MessageActionRow().addComponents([new MessageButton().setCustomId("generate-ban-pool-code").setLabel("Generate code").setStyle("SUCCESS")]);
		const rowDisabled = new MessageActionRow().addComponents([new MessageButton().setCustomId("generate-ban-pool-code").setLabel("Generate code").setStyle("SUCCESS").setDisabled(true)]);

		const msg: Message = await context.channel.send({
			content: "Press the green button to generate your banpool code",
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
					id: context.author.id
				},
				banpool: {
					name,
					code,
					expires: Math.floor(Date.now() / 1000) + 15 * 60
				}
			})

			setTimeout(() => {
				this.client.banpoolInvites.delete(code)
			}, 15 * 60 * 1000)

			await msg.edit({ components: [rowDisabled] });

			interaction.reply({
				ephemeral: true,
				content: `Here is your banpool code \`${code}\` for the **${name}** pool. Keep it safe until the other server uses it to join. It will expire <t:${Math.floor(
					Date.now() / 1000 + 15 * 60,
				)}:R> and only has **one** use. The other server can use the \`!banpool join ${code}\` command to join the pool.`,
			});
		});

		collector.on("end", async () => {
			await msg.edit({ components: [rowDisabled] });
		});
	}
}

function createInviteCode(): string {
	const chars: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	let res: string = "";

	for (let _ = 0; _ < 10; _++) res += chars[Math.floor(Math.random() * chars.length)];

	return res;
}
