import { Message, MessageActionRow, MessageButton, MessageComponentInteraction, MessageSelectMenu, MessageSelectOptionData, Snowflake } from "discord.js";
import BulbBotClient from "../../../../structures/BulbBotClient";
import DatabaseManager from "../../../../utils/managers/DatabaseManager";
import { AutoModConfiguration } from "../../../../utils/types/DatabaseStructures";
import AutoModPart from "../../../../utils/types/AutoModPart";
import { NonDigits } from "../../../../utils/Regex";
import imageHash from "imghash";
import axios from "axios";

const databaseManager: DatabaseManager = new DatabaseManager();

async function add(interaction: MessageComponentInteraction, client: BulbBotClient, category?: string, items?: string[]): Promise<void> {
	const config: AutoModConfiguration = await databaseManager.getAutoModConfig(interaction.guild?.id as Snowflake);
	let pages: MessageSelectOptionData[][] | undefined;
	const currPage = 0;

	const selectedCategory: string | undefined = category;
	const selectedItems: string[] | undefined = items;

	if (selectedCategory) {
		pages = config[selectedCategory].reduce((resultArray: any[], item: any, index: number) => {
			const chunkIndex = Math.floor(index / 25);

			if (!resultArray[chunkIndex]) {
				resultArray[chunkIndex] = []; // start a new chunk
			}

			resultArray[chunkIndex].push({ label: item, value: item, default: items?.includes(item) });

			return resultArray;
		}, []);
	}

	const [header, back, buttonAdd, buttonRemove] = [
		await client.bulbutils.translate("config_automod_add_remove_header", interaction.guild?.id, {}),
		await client.bulbutils.translate("config_button_back", interaction.guild?.id, {}),
		await client.bulbutils.translate("config_automod_add_remove_button_add", interaction.guild?.id, {}),
		await client.bulbutils.translate("config_automod_add_remove_button_remove", interaction.guild?.id, {}),
	];

	const categoryRow = new MessageActionRow().addComponents(
		new MessageSelectMenu()
			.setCustomId("category")
			.setPlaceholder(await client.bulbutils.translate("config_main_placeholder", interaction.guild?.id, {}))
			.setOptions([
				{ label: "Website filter", value: "websiteWhitelist", default: selectedCategory === "websiteWhitelist" },
				{ label: "Invite filter", value: "inviteWhitelist", default: selectedCategory === "inviteWhitelist" },
				{ label: "Word filter", value: "wordBlacklist", default: selectedCategory === "wordBlacklist" },
				{ label: "Word_token filter", value: "wordBlacklistToken", default: selectedCategory === "wordBlacklistToken" },
				{ label: "Avatar hashes", value: "avatarHashes", default: selectedCategory === "avatarHashes" },
				{ label: "Ignore channels", value: "ignoreChannels", default: selectedCategory === "ignoreChannels" },
				{ label: "Ignore roles", value: "ignoreRoles", default: selectedCategory === "ignoreRoles" },
				{ label: "Ignore users", value: "ignoreUsers", default: selectedCategory === "ignoreUsers" },
			]),
	);

	const listRow = new MessageActionRow().addComponents(
		new MessageSelectMenu()
			.setCustomId("list")
			.setOptions(pages && pages.length ? pages[currPage] : [{ label: "placeholder", value: "placeholder" }])
			.setMinValues(1)
			.setDisabled(selectedCategory === undefined || config[selectedCategory].length === 0),
	);

	const scrollRow = new MessageActionRow().addComponents([
		new MessageButton()
			.setCustomId("left")
			.setLabel("<")
			.setStyle("PRIMARY")
			.setDisabled(currPage === 0 || !pages || pages.length === 0),
		new MessageButton()
			.setCustomId("right")
			.setLabel(">")
			.setStyle("PRIMARY")
			.setDisabled(!pages || pages.length === 0 || currPage === pages.length - 1),
	]);

	const buttonRow = new MessageActionRow().addComponents([
		new MessageButton().setCustomId("back").setLabel(back).setStyle("DANGER"),
		new MessageButton().setCustomId("add").setLabel(buttonAdd).setStyle("SUCCESS").setDisabled(!selectedCategory),
		new MessageButton().setCustomId("remove").setLabel(buttonRemove).setStyle("PRIMARY").setDisabled(!selectedItems),
	]);

	interaction.deferred
		? await interaction.editReply({ content: header, components: [categoryRow, listRow, scrollRow, buttonRow] })
		: await interaction.update({ content: header, components: [categoryRow, listRow, scrollRow, buttonRow] });

	const filter = (i: MessageComponentInteraction) => i.user.id === interaction.user.id;
	const collector = interaction.channel?.createMessageComponentCollector({ filter, time: 60000 });

	collector?.on("collect", async (i: MessageComponentInteraction) => {
		if (i.isButton()) {
			switch (i.customId) {
				case "back":
					collector.stop();
					await require("../automod").default(i, client);
					break;
				case "remove":
					collector.stop();

					if (selectedCategory) await databaseManager.automodRemove(interaction.guild?.id as Snowflake, categories[selectedCategory], selectedItems as string[]);
					await interaction.followUp({
						content: await client.bulbutils.translate("config_automod_add_remove_remove_success", interaction.guild?.id, {}),
						ephemeral: true,
					});

					await add(i, client, selectedCategory);
					break;
				case "add":
					collector.stop();
					await i.deferUpdate();

					await interaction.followUp({
						content: await client.bulbutils.translate("config_automod_add_remove_add_prompt", interaction.guild?.id, {}),
						ephemeral: true,
					});

					const msgFilter = (m: Message) => m.author.id === interaction.user.id;
					const msgCollector = interaction.channel?.createMessageCollector({ filter: msgFilter, time: 60000, max: 1 });

					msgCollector?.on("collect", async (m: Message) => {
						await m.delete();
						let appendContent = m.content;
						if (selectedCategory && config[selectedCategory].includes(appendContent)) {
							await interaction.followUp({
								content: await client.bulbutils.translate("config_automod_add_remove_add_already_exists", interaction.guild?.id, {
									item: appendContent,
								}),
								ephemeral: true,
							});
							return add(i, client, selectedCategory);
						}

						// parsing of objects being done

						// whitelist roles should only allow roles
						if (selectedCategory === "ignoreRoles") {
							const roles = appendContent.replace(NonDigits, "");
							if (!i.guild?.roles.cache.get(roles)) {
								await interaction.followUp({
									content: await client.bulbutils.translate("config_automod_add_remove_add_invalid_role", interaction.guild?.id, {
										item: appendContent,
									}),
									ephemeral: true,
								});
								return add(i, client, selectedCategory);
							} else appendContent = roles;
						}

						// whitelist channels only allow channels
						else if (selectedCategory === "ignoreChannels") {
							const channels = appendContent.replace(NonDigits, "");
							if (!i.guild?.channels.cache.get(channels)) {
								await interaction.followUp({
									content: await client.bulbutils.translate("config_automod_add_remove_add_invalid_channel", interaction.guild?.id, {
										item: appendContent,
									}),
									ephemeral: true,
								});
								return add(i, client, selectedCategory);
							} else appendContent = channels;
						}

						// whitelist users only allow users ids
						else if (selectedCategory === "ignoreUsers") {
							const users = appendContent.replace(NonDigits, "");
							if (!i.guild?.members.cache.get(users)) {
								await interaction.followUp({
									content: await client.bulbutils.translate("config_automod_add_remove_add_invalid_user", interaction.guild?.id, {
										item: appendContent,
									}),
									ephemeral: true,
								});
								return add(i, client, selectedCategory);
							} else appendContent = users;
						}

						// handle the avatar bans
						else if (selectedCategory === "avatarHashes") {
							const user = await client.bulbfetch.getUser(appendContent.replace(NonDigits, ""));
							if (!user) appendContent = "";
							else {
								const buffer = await axios.get(user?.displayAvatarURL(), {
									responseType: "arraybuffer",
								});
								appendContent = await imageHash.hash(buffer.data, 8);
							}
						}

						if (!interaction.guild?.id) return;
						if (selectedCategory) await databaseManager.automodAppend(interaction.guild?.id, categories[selectedCategory], [appendContent]);

						await interaction.followUp({
							content: await client.bulbutils.translate("config_automod_add_remove_add_success", interaction.guild?.id, {}),
							ephemeral: true,
						});
						await add(i, client, selectedCategory);
					});

					break;
			}
		} else if (i.isSelectMenu()) {
			if (i.customId === "category") {
				collector.stop();
				await add(i, client, i.values[0]);
			} else if (i.customId === "list") {
				collector.stop();
				await add(i, client, selectedCategory, i.values);
			}
		}
	});
}

const categories = {
	websiteWhitelist: AutoModPart.website,
	inviteWhitelist: AutoModPart.invite,
	wordBlacklist: AutoModPart.word,
	wordBlacklistToken: AutoModPart.token,
	ignoreChannels: AutoModPart.ignore_channel,
	ignoreRoles: AutoModPart.ignore_role,
	ignoreUsers: AutoModPart.ignore_user,
	avatarHashes: AutoModPart.avatars,
};

export default add;
