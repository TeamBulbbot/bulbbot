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
			description: "Sends a bigger version of the given emoji(s)",
			category: "Miscellaneous",
			usage: "<emoji>",
			examples: ["jumbo 🍰"],
			argList: ["emoji:Emoji"],
			minArgs: 1,
			maxArgs: -1,
			clientPerms: ["ATTACH_FILES"],
		});
	}

	public async run(context: CommandContext, args: string[]): Promise<void | Message> {
		const startMessage = await context.channel.send(await this.client.bulbutils.translate("jumbo_start", context.guild?.id, {}));

		const PATH = `${__dirname}/../../../files`;
		const TWEMOJI_VERSION = "13.1.0";
		let doesIncludeAnimatedEmoji = false;

		const SIZE = 250;
		const imgPath: any = [];
		sharp.cache({ files: 0 });

		const realList: string[] = [];
		for (let i = 0; i < args.length; i++) {
			const customEmoji = args[i].match(CustomEmote);
			if (!customEmoji) realList.push(...args[i]);
			else {
				realList.push(...customEmoji);
				if (customEmoji[0].startsWith("<a:")) doesIncludeAnimatedEmoji = true;
			}
		}

		if (realList.length > 1 && doesIncludeAnimatedEmoji) return startMessage.edit(await this.client.bulbutils.translate("jumbo_too_many_animated", context.guild?.id, {}));
		if (realList.length > 10) return startMessage.edit(await this.client.bulbutils.translate("jumbo_too_many", context.guild?.id, {}));

		try {
			const jumboList: string[] = [];

			const sharpCanvas = sharp({
				create: {
					width: SIZE * realList.length + 1,
					height: SIZE,
					channels: 4,
					background: { r: 0, g: 0, b: 0, alpha: 0 },
				},
				animated: doesIncludeAnimatedEmoji,
			});

			if (doesIncludeAnimatedEmoji) sharpCanvas.gif();
			else sharpCanvas.png();
			await sharpCanvas.toFile(`${PATH}/${context.author.id}-${context.guild?.id}.${doesIncludeAnimatedEmoji ? "gif" : "png"}`);
			jumboList.push(`${context.author.id}-${context.guild?.id}.${doesIncludeAnimatedEmoji ? "gif" : "png"}`);

			for (let i = 0; i < realList.length; i++) {
				let emote: Nullable<RegExpMatchArray | string> = realList[i];
				let emoteName: string;

				emote = emote.match(CustomEmote);

				if (emote === null) {
					emoteName = await emojiUnicode(realList[i]).split(" ").join("-");
					if (!existsSync(join(PATH, `${emoteName}.png`)))
						await DownloadEmoji(`https://cdnjs.cloudflare.com/ajax/libs/twemoji/${TWEMOJI_VERSION}/svg/${emoteName}.svg`, "png", emote, emoteName, SIZE, PATH, TWEMOJI_VERSION);

					jumboList.push(`${emoteName}.png`);
				} else {
					const extension = emote[0].startsWith("<a:") ? "gif" : "png";
					emote = emote[0].substring(1).slice(0, -1);
					emote = emote.match(GetEverythingAfterColon) || [];
					emoteName = emote[0];
					if (!emoteName) continue;

					if (!existsSync(join(PATH, `${emoteName}.${extension}`)))
						await DownloadEmoji(`https://cdn.discordapp.com/emojis/${emoteName}.${extension}?v=1&quality=lossless`, extension, emote, emoteName, SIZE, PATH, TWEMOJI_VERSION);
					jumboList.push(`${emoteName}.${extension}`);
				}
			}

			if (doesIncludeAnimatedEmoji)
				await startMessage.edit({
					files: [
						{
							attachment: `${PATH}/${jumboList[1]}`,
							name: "jumbo.gif",
							description: `Jumbo created by ${context.author.tag} (${context.author.id})`,
						},
					],
					content: null,
				});
			else {
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
				await startMessage.edit({
					files: [
						{
							attachment: `${PATH}/final-${context.author.id}-${context.guild?.id}.png`,
							name: "jumbo.png",
							description: `Jumbo created by ${context.author.tag} (${context.author.id})`,
						},
					],
					content: null,
				});
				unlinkSync(`${PATH}/final-${context.author.id}-${context.guild?.id}.png`);
			}

			unlinkSync(`${PATH}/${context.author.id}-${context.guild?.id}.${doesIncludeAnimatedEmoji ? "gif" : "png"}`);
		} catch (err) {
			this.client.log.error(`[JUMBO] ${context.author.tag} (${context.author.id}) had en error: `, err);
			return startMessage.edit(await this.client.bulbutils.translate("jumbo_invalid", context.guild?.id, {}));
		}
	}
}

async function DownloadEmoji(url: string, extension: string, emote: any, emoteName: string, size: number, path: string, twemojiVersion: string) {
	try {
		await axios.get(url, { responseType: "arraybuffer" }).then(async (res) => {
			const sharpEmoji = sharp(res.data, {
				density: 2400,
				animated: extension === "gif",
			}).resize(size, size);
			if (extension === "gif") sharpEmoji.gif();
			else sharpEmoji.png();
			await sharpEmoji.toFile(`${path}/${emoteName}.${extension}`);

			return sharpEmoji;
		});
	} catch (error) {
		if (CustomEmote.test(emote)) throw error;

		url = `https://cdnjs.cloudflare.com/ajax/libs/twemoji/${twemojiVersion}/svg/${emoteName.split("-fe0f").join("")}.svg`;

		await axios.get(url, { responseType: "arraybuffer" }).then(async (res) => {
			return await sharp(res.data, { density: 2400 }).png().resize(size, size).toFile(`${path}/${emoteName}.${extension}`);
		});
	}
}
