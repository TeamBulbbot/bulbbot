const Discord = require("discord.js");
const Command = require("../../structures/Command");
const Jimp = require("jimp");
const fs = require("fs");
const emojiUnicode = require("emoji-unicode");
const { Emote } = require("../../utils/Regex");

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			description: "Sends a bigger version of the given emote(s)",
			category: "Miscellaneous",
			usage: "!jumbo <emote>",
			argList: ["emote:Emote"],
			minArgs: 1,
			maxArgs: -1,
		});
	}

	async run(message, args) {
		const size = 200;

		new Jimp(args.length * size, size, 0x0, async function (err, image) {
			await image.writeAsync(`src/files/jumbo/${message.author.id}-${message.guild.id}.png`);
		});

		for (let i = 0; i < args.length; i++) {
			let emote = args[i];
			let url;

			emote = emote.match(Emote);
			if (emote === null) {
				url = `https://twemoji.maxcdn.com/v/latest/72x72/${emojiUnicode(args[i]).split(" ").join("-")}.png`;
			} else {
				emote = emote[0].substring(1).slice(0, -1);
				url = `https://cdn.discordapp.com/emojis/${emote}.png?v=1`;
			}

			let image = await Jimp.read(url);
			image.resize(size, Jimp.AUTO);
			await image.writeAsync(`src/files/jumbo/${i}-${message.author.id}-${message.guild.id}.png`);
		}
		for (let i = 0; i < args.length; i++) {
			const newEmote = await Jimp.read(`src/files/jumbo/${i}-${message.author.id}-${message.guild.id}.png`);
			const orgImg = await Jimp.read(`src/files/jumbo/${message.author.id}-${message.guild.id}.png`);
			orgImg.composite(newEmote, i * size, 0, {
				mode: Jimp.BLEND_SOURCE_OVER,
				opacityDest: 1,
			});
			await orgImg.writeAsync(`src/files/jumbo/${message.author.id}-${message.guild.id}.png`);
		}
		await message.channel.send("", {
			files: [`src/files/jumbo/${message.author.id}-${message.guild.id}.png`],
		});

		fs.unlinkSync(`src/files/jumbo/${message.author.id}-${message.guild.id}.png`);
		for (let i = 0; i < args.length; i++) {
			try {
				fs.unlinkSync(`src/files/jumbo/${i}-${message.author.id}-${message.guild.id}.png`);
			} catch (error) {
				continue;
			}
		}
	}
};
