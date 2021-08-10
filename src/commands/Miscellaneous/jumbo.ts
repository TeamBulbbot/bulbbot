import Command from "../../structures/Command";
import { Message } from "discord.js";
import * as fs from "fs";
import { CustomEmote, GetEverythingAfterColon } from "../../utils/Regex";
import axios from "axios";
import sharp from "sharp";
import emojiUnicode from "emoji-unicode";
import BulbBotClient from "../../structures/BulbBotClient";

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

	public async run(message: Message, args: string[]): Promise<void | Message> {
		try {
			if (args.length > 10) return message.channel.send(await this.client.bulbutils.translate("jumbo_too_many", message.guild?.id, {}));

			const size: number = 250;
			const imgPath: any = [];

			sharp.cache({ files: 0 });

			await sharp({
				create: {
					width: size * args.length + 1,
					height: size,
					channels: 4,
					background: { r: 0, g: 0, b: 0, alpha: 0 },
				},
			})
				.png()
				.toFile(`files/jumbo/${message.author.id}-${message.guild?.id}.png`);

			for (let i = 0; i < args.length; i++) {
				let emote: RegExpMatchArray | string = args[i];
				let url: string;

				emote = <RegExpMatchArray>emote.match(CustomEmote);

				if (emote === null) {
					url = `https://cdnjs.cloudflare.com/ajax/libs/twemoji/13.0.1/svg/${emojiUnicode(args[i]).split(" ").join("-")}.svg`;
				} else {
					emote = emote[0].substring(1).slice(0, -1);
					emote = <RegExpMatchArray>emote.match(GetEverythingAfterColon);

					url = `https://cdn.discordapp.com/emojis/${emote[0]}.png?v=1`;
				}

				try {
					await axios.get(url, { responseType: "arraybuffer" }).then(async res => {
						return await sharp(res.data, { density: 2400 }).png().resize(size, size).toFile(`files/jumbo/${i}-${message.author.id}-${message.guild?.id}.png`);
					});
				} catch (error) {
					if (CustomEmote.test(<string>(<unknown>emote))) throw error;

					url = `https://cdnjs.cloudflare.com/ajax/libs/twemoji/13.0.1/svg/${emojiUnicode(args[i]).split(" ").join("-").split("-fe0f").join("")}.svg`;

					await axios.get(url, { responseType: "arraybuffer" }).then(async res => {
						return await sharp(res.data, { density: 2400 }).png().resize(size, size).toFile(`files/jumbo/${i}-${message.author.id}-${message.guild?.id}.png`);
					});
				}

				imgPath.push({
					input: `files/jumbo/${i}-${message.author.id}-${message.guild?.id}.png`,
					gravity: "southeast",
					top: 0,
					left: size * i,
					density: 2400,
					premultiplied: true,
				});
			}

			await sharp(`files/jumbo/${message.author.id}-${message.guild?.id}.png`).composite(imgPath).png().toFile(`files/jumbo/final-${message.author.id}-${message.guild?.id}.png`);

			await message.channel.send({
				files: [`files/jumbo/final-${message.author.id}-${message.guild?.id}.png`],
			});

			fs.unlinkSync(`files/jumbo/${message.author.id}-${message.guild?.id}.png`);
			fs.unlinkSync(`files/jumbo/final-${message.author.id}-${message.guild?.id}.png`);
			for (let i = 0; i < args.length; i++) {
				try {
					fs.unlinkSync(`files/jumbo/${i}-${message.author.id}-${message.guild?.id}.png`);
				} catch (error) {
					continue;
				}
			}
		} catch (error) {
			return message.channel.send(await this.client.bulbutils.translate("jumbo_invalid", message.guild?.id, {}));
		}
	}
}
