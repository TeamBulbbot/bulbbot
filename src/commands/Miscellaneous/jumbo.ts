import Command from "../../structures/Command";
import CommandContext from "../../structures/CommandContext";
import { Message } from "discord.js";
import { existsSync, unlinkSync } from "fs";
import { CustomEmote, GetEverythingAfterColon } from "../../utils/Regex";
import axios from "axios";
import sharp from "sharp";
import emojiUnicode from "emoji-unicode";
import BulbBotClient from "../../structures/BulbBotClient";
import { join } from "path";

export default class extends Command {
	constructor(client: BulbBotClient, name: string) {
		super(client, {
			name,
			description: "Sends a bigger version of the given emote(s)",
			category: "Miscellaneous",
			usage: "<emote>",
			examples: ["jumbo 🍰"],
			argList: ["emote:Emote"],
			minArgs: 1,
			maxArgs: -1,
			clientPerms: ["ATTACH_FILES"],
		});
	}

	public async run(context: CommandContext, args: string[]): Promise<void | Message> {
		const PATH: string = `${__dirname}/../../../files`;
		const TWEMOJI_VERSION: string = "13.1.0";

		const SIZE: number = 250;
		const imgPath: any = [];
		sharp.cache({ files: 0 });

		if (args.length > 10) return context.channel.send(await this.client.bulbutils.translate("jumbo_too_many", context.guild?.id, {}));

		try {
			const jumboList: string[] = [];

			// creat blank canvas
			await sharp({
				create: {
					width: SIZE * args.length + 1,
					height: SIZE,
					channels: 4,
					background: { r: 0, g: 0, b: 0, alpha: 0 },
				},
			})
				.png()
				.toFile(`${PATH}/${context.author.id}-${context.guild?.id}.png`);

			jumboList.push(`${context.author.id}-${context.guild?.id}.png`);

			for (let i = 0; i < args.length; i++) {
				let emote: RegExpMatchArray | string = args[i];
				let emoteName: string;

				emote = <RegExpMatchArray>emote.match(CustomEmote);

				if (emote === null) {
					emoteName = await emojiUnicode(args[i]).split(" ").join("-");

					if (!existsSync(join(PATH, `${emoteName}.png`)))
						await DownloadEmoji(`https://cdnjs.cloudflare.com/ajax/libs/twemoji/${TWEMOJI_VERSION}/svg/${emoteName}.svg`, emote, emoteName, SIZE, PATH, TWEMOJI_VERSION);
				} else {
					emote = emote[0].substring(1).slice(0, -1);
					emote = <RegExpMatchArray>emote.match(GetEverythingAfterColon);
					emoteName = emote[0];

					if (!existsSync(join(PATH, `${emoteName}.png`))) await DownloadEmoji(`https://cdn.discordapp.com/emojis/${emoteName}.png?v=1`, emote, emoteName, SIZE, PATH, TWEMOJI_VERSION);
				}

				jumboList.push(`${emoteName}.png`);
			}

			for (let i = 1; i < jumboList.length; i++) {
				imgPath.push({
					input: `${PATH}/${jumboList[i]}`,
					gravity: "southeast",
					top: 0,
					left: SIZE * (i - 1),
					density: 2400,
					premultiplied: true,
				});
			}

			await sharp(`${PATH}/${jumboList[0]}`).composite(imgPath).png().toFile(`${PATH}/final-${context.author.id}-${context.guild?.id}.png`);
			await context.channel.send({
				files: [`${PATH}/final-${context.author.id}-${context.guild?.id}.png`],
			});

			unlinkSync(`${PATH}/${context.author!.id}-${context.guild!.id}.png`);
			unlinkSync(`${PATH}/final-${context.author!.id}-${context.guild!.id}.png`);
		} catch (err) {
			this.client.log.error(`[JUMBO] ${context.author.tag} (${context.author.id}) had en error: `, err);
			return context.channel.send(await this.client.bulbutils.translate("jumbo_invalid", context.guild?.id, {}));
		}
	}
}

async function DownloadEmoji(url: string, emote: any, emoteName: string, size: number, path: string, twemojiVersion: string): Promise<void> {
	try {
		await axios.get(url, { responseType: "arraybuffer" }).then(async res => {
			return await sharp(res.data, { density: 2400 }).png().resize(size, size).toFile(`${path}/${emoteName}.png`);
		});
	} catch (error) {
		if (CustomEmote.test(<string>(<unknown>emote))) throw error;

		url = `https://cdnjs.cloudflare.com/ajax/libs/twemoji/${twemojiVersion}/svg/${emoteName.split("-fe0f").join("")}.svg`;

		await axios.get(url, { responseType: "arraybuffer" }).then(async res => {
			return await sharp(res.data, { density: 2400 }).png().resize(size, size).toFile(`${path}/${emoteName}.png`);
		});
	}
}
