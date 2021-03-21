const Command = require("../../structures/Command");
const sharp = require("sharp");
const fs = require("fs");
const emojiUnicode = require("emoji-unicode");
const { CustomEmote, GetEverythingAfterColon } = require("../../utils/Regex");
const axios = require("axios");

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			description: "Sends a bigger version of the given emote(s)",
			category: "Miscellaneous",
			usage: "!jumbo <emote>",
			examples: ["jumbo 🍰"],
			argList: ["emote:Emote"],
			minArgs: 1,
			maxArgs: -1,
		});
	}

	async run(message, args) {
		try {
			if (args.length > 10) return message.channel.send(await this.client.bulbutils.translate("jumbo_too_many"));

			const size = 250;
			const imgPath = [];

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
				.toFile(`src/files/jumbo/${message.author.id}-${message.guild.id}.png`);

			for (let i = 0; i < args.length; i++) {
				let emote = args[i];
				let url;

				emote = emote.match(CustomEmote);

				if (emote === null) {
					url = `https://cdnjs.cloudflare.com/ajax/libs/twemoji/13.0.1/svg/${emojiUnicode(args[i]).split(" ").join("-")}.svg`;
				} else {
					emote = emote[0].substring(1).slice(0, -1);
					emote = emote.match(GetEverythingAfterColon);

					url = `https://cdn.discordapp.com/emojis/${emote[0]}.png?v=1`;
				}

				await axios
					.get(url, { responseType: "arraybuffer" })
					.then(async res => {
						return await sharp(res.data, { density: 2400 })
							.png()
							.resize(size, size)
							.toFile(`src/files/jumbo/${i}-${message.author.id}-${message.guild.id}.png`);
					})
					.catch(err => {
						console.error(err);
					});

				imgPath.push({
					input: `src/files/jumbo/${i}-${message.author.id}-${message.guild.id}.png`,
					gravity: "southeast",
					top: size,
					left: size * i,
					density: 2400,
					premultiplied: true,
				});
			}

			await sharp(`src/files/jumbo/${message.author.id}-${message.guild.id}.png`)
				.composite(imgPath)
				.png()
				.toFile(`src/files/jumbo/final-${message.author.id}-${message.guild.id}.png`);

			await message.channel.send({
				files: [`src/files/jumbo/final-${message.author.id}-${message.guild.id}.png`],
			});

			fs.unlinkSync(`src/files/jumbo/${message.author.id}-${message.guild.id}.png`);
			fs.unlinkSync(`src/files/jumbo/final-${message.author.id}-${message.guild.id}.png`);
			for (let i = 0; i < args.length; i++) {
				try {
					fs.unlinkSync(`src/files/jumbo/${i}-${message.author.id}-${message.guild.id}.png`);
				} catch (error) {
					continue;
				}
			}
		} catch (error) {
			return message.channel.send(await this.client.bulbutils.translate("jumbo_invalid_emoji"));
		}
	}
};
