const fs = require("fs");
const Jimp = require("jimp");
const Twemoji = require("twemoji");

const Emotes = require("../../emotes.json");

module.exports = {
	name: "jumbo",
	category: "miscellaneous",
	description: "Sends a bigger version of the given emote(s)",
	usage: "jumbo <emotes>",
	clientPermissions: ["ATTACH_FILES", "SEND_MESSAGES", "VIEW_CHANNEL"],
	userPermissions: [],
	clearanceLevel: 0,
	run: async (client, message, args) => {
		const size = 150;
		if (!args[0])
			return message.channel.send(
				`${Emotes.actions.warn} Missing required argument \`\`emotes\`\`\n${Emotes.other.tools} Correct usage of command: \`\`jumbo <emotes>\`\``
			);
		if (args.length > 8)
			return message.channel.send(
				`${Emotes.actions.warn} Max amount of \`\`emotes\`\`, please have fewer than 8 emotes in each jumbo\n${Emotes.other.tools} Correct usage of command: \`\`jumbo <emotes>\`\``
			);

		await message.channel
			.send(`${Emotes.other.loading} Gathering the emotes`)
			.then(async (msg) => {
				new Jimp(args.length * size, 150, 0x0, async function (err, image) {
					await image.writeAsync(
						`src/files/jumbo/${message.author.id}-${message.guild.id}.png`
					);
				});

				for (let i = 0; i < args.length; i++) {
					let emote = args[i];

					if (Twemoji.convert.toCodePoint(emote).length > 10) {
						emote = emote.match(/:[0-9>]{17,}>+/g);
						emote = emote[0].substring(1).slice(0, -1);

						let image = await Jimp.read(
							`https://cdn.discordapp.com/emojis/${emote}.png?v=1`
						);
						image.resize(size, Jimp.AUTO);
						await image.writeAsync(
							`src/files/jumbo/${i}-${message.author.id}-${message.guild.id}.png`
						);
					} else {
						if (Twemoji.convert.toCodePoint(emote).length >= 6)
							emote = Twemoji.convert.toCodePoint(emote).slice(0, -5);
						else emote = Twemoji.convert.toCodePoint(emote);

						let image = await Jimp.read(
							"https://twemoji.maxcdn.com/v/latest/72x72/" + emote + ".png"
						);
						image.resize(size, Jimp.AUTO);
						await image.writeAsync(
							`src/files/jumbo/${i}-${message.author.id}-${message.guild.id}.png`
						);
					}
				}

				for (let i = 0; i < args.length; i++) {
					const newEmote = await Jimp.read(
						`src/files/jumbo/${i}-${message.author.id}-${message.guild.id}.png`
					);

					const orgImg = await Jimp.read(
						`src/files/jumbo/${message.author.id}-${message.guild.id}.png`
					);
					orgImg.composite(newEmote, i * size, 0, {
						mode: Jimp.BLEND_SOURCE_OVER,
						opacityDest: 1,
					});
					await orgImg.writeAsync(
						`src/files/jumbo/${message.author.id}-${message.guild.id}.png`
					);
				}

				await message.channel.send(``, {
					files: [
						`src/files/jumbo/${message.author.id}-${message.guild.id}.png`,
					],
				});
				msg.delete();
			});
		fs.unlinkSync(
			`src/files/jumbo/${message.author.id}-${message.guild.id}.png`
		);
		for (let i = 0; i < args.length; i++) {
			try {
				fs.unlinkSync(
					`src/files/jumbo/${i}-${message.author.id}-${message.guild.id}.png`
				);
			} catch (error) {
				continue;
			}
		}
	},
};
