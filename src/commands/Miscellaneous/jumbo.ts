import { CommandInteraction } from "discord.js";
import { existsSync, unlinkSync } from "fs";
import { CustomEmote, GetEverythingAfterColon } from "../../utils/Regex";
import axios from "axios";
import sharp from "sharp";
import emojiUnicode from "emoji-unicode";
import BulbBotClient from "../../structures/BulbBotClient";
import { join } from "path";
import ApplicationCommand from "../../structures/ApplicationCommand";
import { ApplicationCommandOptionType, ApplicationCommandType } from "discord-api-types/v10";

export default class extends ApplicationCommand {
	constructor(client: BulbBotClient, name: string) {
		super(client, {
			name,
			description: "Sends a bigger version of the given emoji(s)",
			type: ApplicationCommandType.ChatInput,
			options: [
				{
					name: "emoji",
					type: ApplicationCommandOptionType.String,
					description: "The emoji(s) you want to send a bigger version of",
					required: true,
				},
			],
		});
	}

	public async run(interaction: CommandInteraction): Promise<void> {
		await interaction.deferReply({
			ephemeral: true,
		});

		const emojis = interaction.options.getString("emoji")?.split(" ") as string[];

		const PATH = `${__dirname}/../../../files`;
		const TWEMOJI_VERSION = "13.1.0";
		let doesIncludeAnimatedEmoji = false;

		const SIZE = 250;
		const imgPath: any = [];
		sharp.cache({ files: 0 });

		const realList: string[] = [];
		for (let i = 0; i < emojis.length; i++) {
			const customEmoji = emojis[i].match(CustomEmote);
			if (!customEmoji) realList.push(...emojis[i]);
			else {
				realList.push(...customEmoji);
				if (customEmoji[0].startsWith("<a:")) doesIncludeAnimatedEmoji = true;
			}
		}

		if (realList.length > 1 && doesIncludeAnimatedEmoji)
			return void (await interaction.followUp({
				content: await this.client.bulbutils.translate("jumbo_too_many_animated", interaction.guild?.id, {}),
				ephemeral: true,
			}));
		if (realList.length > 10)
			return void (await interaction.followUp({
				content: await this.client.bulbutils.translate("jumbo_too_many", interaction.guild?.id, {}),
				ephemeral: true,
			}));

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
			await sharpCanvas.toFile(`${PATH}/${interaction.user.id}-${interaction.guild?.id}.${doesIncludeAnimatedEmoji ? "gif" : "png"}`);
			jumboList.push(`${interaction.user.id}-${interaction.guild?.id}.${doesIncludeAnimatedEmoji ? "gif" : "png"}`);

			for (let i = 0; i < realList.length; i++) {
				let emote: Nullable<RegExpMatchArray | string> = realList[i];
				let emoteName: string;

				emote = emote.match(CustomEmote);

				if (emote === null) {
					emoteName = await emojiUnicode(realList[i]).split(" ").join("-");
					if (!existsSync(join(PATH, `${emoteName}.png`)))
						await this.downloadEmoji(`https://cdnjs.cloudflare.com/ajax/libs/twemoji/${TWEMOJI_VERSION}/svg/${emoteName}.svg`, "png", emote, emoteName, SIZE, PATH, TWEMOJI_VERSION);

					jumboList.push(`${emoteName}.png`);
				} else {
					const extension = emote[0].startsWith("<a:") ? "gif" : "png";
					emote = emote[0].substring(1).slice(0, -1);
					emote = emote.match(GetEverythingAfterColon) || [];
					emoteName = emote[0];
					if (!emoteName) continue;

					if (!existsSync(join(PATH, `${emoteName}.${extension}`)))
						await this.downloadEmoji(`https://cdn.discordapp.com/emojis/${emoteName}.${extension}?v=1&quality=lossless`, extension, emote, emoteName, SIZE, PATH, TWEMOJI_VERSION);
					jumboList.push(`${emoteName}.${extension}`);
				}
			}

			if (doesIncludeAnimatedEmoji) {
				await interaction.followUp(await this.client.bulbutils.translate("ban_message_dismiss", interaction.guild?.id, {}));
				await interaction.followUp({
					files: [
						{
							attachment: `${PATH}/${jumboList[1]}`,
							name: "jumbo.gif",
							description: `Jumbo created by ${interaction.user.tag} (${interaction.user.id})`,
						},
					],
					content: null,
				});
			} else {
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

				await sharp(`${PATH}/${jumboList[0]}`).composite(imgPath).png().toFile(`${PATH}/final-${interaction.user.id}-${interaction.guild?.id}.png`);
				await interaction.followUp(await this.client.bulbutils.translate("ban_message_dismiss", interaction.guild?.id, {}));
				await interaction.followUp({
					files: [
						{
							attachment: `${PATH}/final-${interaction.user.id}-${interaction.guild?.id}.png`,
							name: "jumbo.png",
							description: `Jumbo created by ${interaction.user.tag} (${interaction.user.id})`,
						},
					],
					content: null,
				});
				unlinkSync(`${PATH}/final-${interaction.user.id}-${interaction.guild?.id}.png`);
			}

			unlinkSync(`${PATH}/${interaction.user.id}-${interaction.guild?.id}.${doesIncludeAnimatedEmoji ? "gif" : "png"}`);
		} catch (err) {
			this.client.log.error(`[JUMBO] ${interaction.user.tag} (${interaction.user.id}) had en error: `, err);
			return void (await interaction.followUp({
				content: await this.client.bulbutils.translate("jumbo_invalid", interaction.guild?.id, {}),
				ephemeral: true,
			}));
		}
	}

	private async downloadEmoji(url: string, extension: string, emote: any, emoteName: string, size: number, path: string, twemojiVersion: string) {
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
}
