import { ContextMenuInteraction, GuildMember, Message, Snowflake, User } from "discord.js";
import * as Emotes from "../emotes.json";
import moment, { Duration, Moment } from "moment";
import BulbBotClient from "../structures/BulbBotClient";
import { UserHandle } from "./types/UserHandle";
import i18next, { TOptions } from "i18next";
import { translatorEmojis, translatorConfig } from "../Config";
import TranslateString from "./types/TranslateString";

export default class {
	private readonly client: BulbBotClient;

	constructor(client: BulbBotClient) {
		this.client = client;
	}

	public async translate(string: TranslateString, guildID: Snowflake = "742094927403679816", options: TOptions): Promise<string> {
		// await i18next.changeLanguage(lng)
		return await i18next.t(string, { ...options, ...translatorEmojis, ...translatorConfig });
	}

	// acts as a placeholder for an actual call to translator, to indicate a string should get a translation
	public async needsTranslation(string: string, ..._: any) {
		return string;
	}

	public badges(bitfield: number) {
		let badges: string[] = [];

		const staff: number = 1 << 0;
		const partner: number = 1 << 1;
		const certifiedMod = 1 << 18;
		const hypesquad_events: number = 1 << 2;
		const bughunter_green: number = 1 << 3;
		const hypesquad_bravery: number = 1 << 6;
		const hypesquad_brilliance: number = 1 << 7;
		const hypesquad_balance: number = 1 << 8;
		const earlysupport: number = 1 << 9;
		const bughunter_gold: number = 1 << 14;
		const botdeveloper: number = 1 << 17;

		if ((bitfield & staff) === staff) badges.push(Emotes.flags.DISCORD_EMPLOYEE);
		if ((bitfield & partner) === partner) badges.push(Emotes.flags.PARTNERED_SERVER_OWNER);
		if ((bitfield & certifiedMod) === certifiedMod) badges.push(Emotes.flags.CERTIFIED_MODERATOR);
		if ((bitfield & hypesquad_events) === hypesquad_events) badges.push(Emotes.flags.HYPESQUAD_EVENTS);
		if ((bitfield & hypesquad_bravery) === hypesquad_bravery) badges.push(Emotes.flags.HOUSE_BRAVERY);
		if ((bitfield & hypesquad_brilliance) === hypesquad_brilliance) badges.push(Emotes.flags.HOUSE_BRILLIANCE);
		if ((bitfield & hypesquad_balance) === hypesquad_balance) badges.push(Emotes.flags.HOUSE_BALANCE);
		if ((bitfield & bughunter_green) === bughunter_green) badges.push(Emotes.flags.BUGHUNTER_LEVEL_1);
		if ((bitfield & bughunter_gold) === bughunter_gold) badges.push(Emotes.flags.BUGHUNTER_LEVEL_2);
		if ((bitfield & botdeveloper) === botdeveloper) badges.push(Emotes.flags.EARLY_VERIFIED_DEVELOPER);
		if ((bitfield & earlysupport) === earlysupport) badges.push(Emotes.flags.EARLY_SUPPORTER);

		return badges.map(i => `${i}`).join(" ");
	}

	public guildFeatures(guildFeatures: any[]) {
		let features: string[] = [];

		guildFeatures.forEach(feature => {
			let f: string = "";
			let desc: string = "";

			if (feature === "ANIMATED_ICON") {
				f = Emotes.features.ANIMATED_ICON;
				desc = "Adds the ability to upload a animated icon to the guild";
			} else if (feature === "BANNER") {
				f = Emotes.features.BANNER;
				desc = "Adds the ability to set a banner image for the guild that will display above the channel list";
			} else if (feature === "COMMERCE") {
				f = Emotes.features.COMMERCE;
				desc = "Adds the ability to create store channels";
			} else if (feature === "COMMUNITY") {
				f = Emotes.features.COMMUNITY;
				desc = "Gives access to the Server Discovery, Insights, Community Server News and Announcement Channels";
			} else if (feature === "DISCOVERABLE") {
				f = Emotes.features.DISCOVERABLE;
				desc = "Makes guild visible in Sever Discovery";
			} else if (feature === "ENABLED_DISCOVERABLE_BEFORE") {
				f = Emotes.features.ENABLED_DISCOVERABLE_BEFORE;
				desc = "Enabled Sever Discovery before the Discovery Checklist was launched";
			} else if (feature === "FORCE_RELAY") {
				f = Emotes.features.FORCE_RELAY;
				desc = "Shard the guild connections to different nodes that relay information between each other";
			} else if (feature === "INVITE_SPLASH") {
				f = Emotes.features.INVITE_SPLASH;
				desc = "Adds the ability to set a background image that will display on the invite links";
			} else if (feature === "MEMBER_LIST_DISABLED") {
				f = Emotes.features.MEMBER_LIST_DISABLED;
				desc = "Hides the member list";
			} else if (feature === "MEMBER_VERIFICATION_GATE_ENABLED") {
				f = Emotes.features.MEMBER_VERIFICATION_GATE_ENABLED;
				desc = "Has member verification gate enabled, which requirers new users to pass verification gate before accessing the guild";
			} else if (feature === "MORE_EMOJI") {
				f = Emotes.features.MORE_EMOJI;
				desc = "Adds 150 extra emote slots in each category (normal and animated)";
			} else if (feature === "NEWS") {
				f = Emotes.features.NEWS;
				desc = "Adds the ability to create announcement channels";
			} else if (feature === "PARTNERED") {
				f = Emotes.features.PARTNERED;
				desc = "Shows the partner badge next to the server name";
			} else if (feature === "PREVIEW_ENABLED") {
				f = Emotes.features.PREVIEW_ENABLED;
				desc = "Enables lurking in the guild";
			} else if (feature === "RELAY_ENABLED" || feature === "RELAY_DISABLED") {
				f = Emotes.features.RELAY_ENABLED;
				desc = "Shard the guild connections to different nodes that relay information between each other";
			} else if (feature === "VANITY_URL") {
				f = Emotes.features.VANITY_URL;
				desc = "Adds the ability to set a custom invite link (discord.gg/CUSTOM_VANITY)";
			} else if (feature === "VERIFIED") {
				f = Emotes.features.VERIFIED;
				desc = "Shows the verfied checkmark next to the server name";
			} else if (feature === "WELCOME_SCREEN_ENABLED") {
				f = Emotes.features.WELCOME_SCREEN_ENABLED;
				desc = "Has the welcome screen enabled enabled, which will show a model when new users join the guild";
			} else if (feature === "FEATURABLE") {
				f = Emotes.features.FEATURABLE;
				desc = "Deprecated";
			} else if (feature === "VIP_REGIONS") {
				f = Emotes.features.VIP_REGIONS;
				desc = "Adds the ability to create voice channels with 384kbps max bitrate";
			} else if (feature === "PRIVATE_THREADS") {
				f = Emotes.features.PRIVATE_THREADS;
				desc = "Grants the ability to create private threads";
			} else if (feature === "SEVEN_DAY_THREAD_ARCHIVE") {
				f = Emotes.features.SEVEN_DAY_THREAD_ARCHIVE;
				desc = "Threads will archive in 7 days";
			} else if (feature === "THREADS_ENABLED") {
				f = Emotes.features.THREADS_ENABLED;
				desc = "Grants the ability to create threads";
			} else if (feature === "THREE_DAY_THREAD_ARCHIVE") {
				f = Emotes.features.THREE_DAY_THREAD_ARCHIVE;
				desc = "Threads will archive in 3 days";
			} else if (feature === "HUB") {
				f = Emotes.features.HUB;
				desc = "Makes the server a school hub server";
			} else if (feature === "MORE_STICKERS") {
				f = Emotes.features.MORE_STICKERS;
				desc = "Makes it possible to have 60 stickers in your server";
			}

			f += `[\`${feature}\`](https://bulbbot.mrphilip.xyz '${desc}')`;
			features.push(f);
		});

		features.sort();

		return features.map(i => `${i}`).join("\n");
	}

	public getUptime(timestamp: number | null) {
		const time: Duration = moment.duration(timestamp, "milliseconds");
		const days: number = Math.floor(time.asDays());
		const hours: number = Math.floor(time.asHours() - days * 24);
		const mins: number = Math.floor(time.asMinutes() - days * 24 * 60 - hours * 60);
		const secs: number = Math.floor(time.asSeconds() - days * 24 * 60 * 60 - hours * 60 * 60 - mins * 60);

		let uptime: string = "";
		if (days > 0) uptime += `${days} day(s), `;
		if (hours > 0) uptime += `${hours} hour(s), `;
		if (mins > 0) uptime += `${mins} minute(s), `;
		if (secs > 0) uptime += `${secs} second(s)`;

		return uptime;
	}

	guildRegion(region: string) {
		region = region.charAt(0).toUpperCase() + region.slice(1);
		switch (region) {
			case "Brazil":
				region = `:flag_br: ${region}`;
				break;
			case "Eu-central":
			case "Europe":
				region = `:flag_eu: ${region}`;
				break;
			case "Hongkong":
				region = `:flag_hk: ${region}`;
				break;
			case "India":
				region = `:flag_in: ${region}`;
				break;
			case "Japan":
				region = `:flag_jp: ${region}`;
				break;
			case "Russia":
				region = `:flag_ru: ${region}`;
				break;
			case "Singapore":
				region = `:flag_sg: ${region}`;
				break;
			case "Southafrica":
				region = `:flag_za: ${region}`;
				break;
			case "Sydney":
				region = `:flag_au: ${region}`;
				break;
			case "Us-central":
			case "Us-east":
			case "Us-south":
			case "Us-west":
				region = `:flag_us: ${region}`;
				break;
			default:
				break;
		}

		return region;
	}

	public async sleep(ms: number) {
		return new Promise(resolve => setTimeout(resolve, ms));
	}
	formatDays(start: Date) {
		const end: string = moment.utc().format("YYYY-MM-DD");
		const date: Moment = moment(moment.utc(start).format("YYYY-MM-DD"));
		const days: number = moment.duration(date.diff(end)).asDays();

		return `${moment.utc(start).format("MMMM, Do YYYY @ hh:mm:ss a")} \`\`(${Math.floor(days).toString().replace("-", "")} day(s) ago)\`\``;
	}

	public userObject(isGuildMember: boolean, userObject: User | GuildMember) {
		let user;

		if (isGuildMember && userObject instanceof GuildMember) {
			user = {
				tag: userObject.user.tag,
				id: userObject.user.id,
				flags: userObject.user.flags,
				username: userObject.user.username,
				discriminator: userObject.user.discriminator,
				avatar: userObject.user.avatar,
				avatarUrl: userObject.user.avatarURL({ dynamic: true, size: 4096 }),
				bot: userObject.user.bot,

				roles: userObject.roles,
				nickname: userObject.nickname,
				premiumSinceTimestamp: userObject.premiumSinceTimestamp,
				joinedTimestamp: userObject.joinedTimestamp,
				createdAt: userObject.user.createdAt,
				createdTimestamp: userObject.user.createdTimestamp,
			};
		} else if (userObject instanceof User) {
			user = {
				tag: userObject.tag,
				id: userObject.id,
				flags: userObject.flags,
				username: userObject.username,
				discriminator: userObject.discriminator,
				avatar: userObject.avatar,
				avatarUrl: userObject.avatarURL({ dynamic: true, size: 4096 }),
				bot: userObject.bot,
				createdAt: userObject.createdAt,
				createdTimestamp: userObject.createdTimestamp,
				nickname: null,
			};
		}
		if (user.avatarUrl === null) user.avatarUrl = `https://cdn.discordapp.com/embed/avatars/${user.discriminator % 5}.png`;

		return user;
	}
	prettify(action: string): string {
		let finalString = "";
		switch (action) {
			case "Ban":
				finalString = `${Emotes.actions.BAN} Ban`;
				break;
			case "Manual Ban":
				finalString = `${Emotes.actions.BAN} Manual Ban`;
				break;
			case "Force-ban":
				finalString = `${Emotes.actions.BAN} Force-ban`;
				break;
			case "Kick":
				finalString = `${Emotes.actions.KICK} Kick`;
				break;
			case "Manual Kick":
				finalString = `${Emotes.actions.BAN} Manual Kick`;
				break;
			case "Mute":
				finalString = `${Emotes.actions.MUTE} Mute`;
				break;
			case "Warn":
				finalString = `${Emotes.actions.WARN} Warn`;
				break;
			case "Unmute":
				finalString = `${Emotes.actions.UNBAN} Unmute`;
				break;
			case "Unban":
				finalString = `${Emotes.actions.UNBAN} Unban`;
				break;
			case "true":
				finalString = `${Emotes.status.ONLINE} True`;
				break;
			case "false":
				finalString = `${Emotes.other.INF2} False`;
				break;
			case "Nickname":
				finalString = `${Emotes.other.EDIT} Nickname`;
				break;
		}

		return finalString;
	}

	checkUser(message: Message, user: GuildMember): UserHandle {
		if (
			message.author.id === message.guild?.ownerId &&
			message.guild?.me &&
			message.guild?.me.roles.highest.id !== user.roles.highest.id &&
			user.roles.highest.rawPosition < message.guild?.me.roles.highest.rawPosition
		)
			return UserHandle.SUCCESS;

		if (user.id === message.author.id) return UserHandle.CANNOT_ACTION_SELF;

		if (message.guild?.ownerId === user.id) return UserHandle.CANNOT_ACTION_OWNER;

		if (message.member?.roles.highest.id === user.roles.highest.id) return UserHandle.CANNOT_ACTION_ROLE_EQUAL;

		if (user.id === this.client.user?.id) return UserHandle.CANNOT_ACTION_BOT_SELF;

		if (message.member?.roles && user.roles.highest.rawPosition >= message.member?.roles.highest.rawPosition) return UserHandle.CANNOT_ACTION_ROLE_HIGHER;

		if (message.guild?.me && message.guild?.me.roles.highest.id === user.roles.highest.id) return UserHandle.CANNOT_ACTION_USER_ROLE_EQUAL_BOT;

		if (message.guild?.me && user.roles.highest.rawPosition >= message.guild?.me.roles.highest.rawPosition) return UserHandle.CANNOT_ACTION_USER_ROLE_HIGHER_BOT;

		return UserHandle.SUCCESS;
	}

	async resolveUserHandle(message: Message, handle: UserHandle, user: User): Promise<boolean> {
		switch (handle) {
			case UserHandle.CANNOT_ACTION_SELF:
				await message.channel.send(await this.translate("global_cannot_action_self", message.guild?.id, {}));
				return true;

			case UserHandle.CANNOT_ACTION_OWNER:
				await message.channel.send(await this.translate("global_cannot_action_owner", message.guild?.id, {}));
				return true;

			case UserHandle.CANNOT_ACTION_ROLE_EQUAL:
				await message.channel.send(await this.translate("global_cannot_action_role_equal", message.guild?.id, { target: user }));
				return true;

			case UserHandle.CANNOT_ACTION_BOT_SELF:
				await message.channel.send(await this.translate("global_cannot_action_bot_self", message.guild?.id, {}));
				return true;

			case UserHandle.CANNOT_ACTION_ROLE_HIGHER:
				await message.channel.send(await this.translate("global_cannot_action_role_equal", message.guild?.id, { target: user }));
				return true;

			case UserHandle.CANNOT_ACTION_USER_ROLE_EQUAL_BOT:
				await message.channel.send(await this.translate("global_cannot_action_role_equal_bot", message.guild?.id, { target: user }));
				return true;

			case UserHandle.CANNOT_ACTION_USER_ROLE_HIGHER_BOT:
				await message.channel.send(await this.translate("global_cannot_action_role_equal_bot", message.guild?.id, { target: user }));
				return true;

			case UserHandle.SUCCESS:
				return false;

			default:
				return false;
		}
	}

	async checkUserFromInteraction(interaction: ContextMenuInteraction, user: GuildMember): Promise<UserHandle> {
		const author = await interaction.guild?.members.fetch(interaction.user.id);

		if (user.id === interaction.user.id) return UserHandle.CANNOT_ACTION_SELF;

		if (interaction.guild?.ownerId === user.id) return UserHandle.CANNOT_ACTION_OWNER;

		if (
			interaction.user.id === interaction.guild?.ownerId &&
			interaction.guild?.me &&
			interaction.guild?.me.roles.highest.id !== user.roles.highest.id &&
			user.roles.highest.rawPosition < interaction.guild?.me.roles.highest.rawPosition
		)
			return UserHandle.SUCCESS;

		if (author?.roles.highest.id === user.roles.highest.id) return UserHandle.CANNOT_ACTION_ROLE_EQUAL;

		if (user.id === this.client.user?.id) return UserHandle.CANNOT_ACTION_BOT_SELF;

		if (author?.roles && user.roles.highest.rawPosition >= author?.roles.highest.rawPosition) return UserHandle.CANNOT_ACTION_ROLE_HIGHER;

		if (interaction.guild?.me && interaction.guild?.me.roles.highest.id === user.roles.highest.id) return UserHandle.CANNOT_ACTION_USER_ROLE_EQUAL_BOT;

		if (interaction.guild?.me && user.roles.highest.rawPosition >= interaction.guild?.me?.roles.highest.rawPosition) return UserHandle.CANNOT_ACTION_USER_ROLE_HIGHER_BOT;

		return UserHandle.SUCCESS;
	}

	async resolveUserHandleFromInteraction(interaction: ContextMenuInteraction, handle: UserHandle, user: User): Promise<boolean> {
		switch (handle) {
			case UserHandle.CANNOT_ACTION_SELF:
				await interaction.reply({ content: await this.translate("global_cannot_action_self", interaction.guild?.id, {}), ephemeral: true });
				return true;

			case UserHandle.CANNOT_ACTION_OWNER:
				await interaction.reply({ content: await this.translate("global_cannot_action_owner", interaction.guild?.id, {}), ephemeral: true });
				return true;

			case UserHandle.CANNOT_ACTION_ROLE_EQUAL:
				await interaction.reply({ content: await this.translate("global_cannot_action_role_equal", interaction.guild?.id, { target: user }), ephemeral: true });
				return true;

			case UserHandle.CANNOT_ACTION_BOT_SELF:
				await interaction.reply({ content: await this.translate("global_cannot_action_bot_self", interaction.guild?.id, {}), ephemeral: true });
				return true;

			case UserHandle.CANNOT_ACTION_ROLE_HIGHER:
				await interaction.reply({ content: await this.translate("global_cannot_action_role_equal", interaction.guild?.id, { target: user }), ephemeral: true });
				return true;

			case UserHandle.CANNOT_ACTION_USER_ROLE_EQUAL_BOT:
				await interaction.reply({ content: await this.translate("global_cannot_action_role_equal_bot", interaction.guild?.id, { target: user }), ephemeral: true });
				return true;

			case UserHandle.CANNOT_ACTION_USER_ROLE_HIGHER_BOT:
				await interaction.reply({ content: await this.translate("global_cannot_action_role_equal_bot", interaction.guild?.id, { target: user }), ephemeral: true });
				return true;

			case UserHandle.SUCCESS:
				return false;

			default:
				return false;
		}
	}

	public readonly timezones: Record<string, string> = {
		ANAT: "Asia/Anadyr",
		AEDT: "Australia/Melbourne",
		AEST: "Australia/Brisbane",
		JST: "Asia/Tokyo",
		AWST: "Asia/Shanghai",
		WIB: "Asia/Jakarta",
		BTT: "Asia/Dhaka",
		UZT: "Asia/Tashkent",
		GST: "Asia/Dubai",
		IST: "Asia/Kolkata",
		MSK: "Europe/Moscow",
		CEST: "Europe/Brussels",
		BST: "Europe/London",
		GMT: "Africa/Accra",
		CVT: "Atlantic/Cape_Verde",
		WGST: "America/Nuuk",
		ART: "America/Buenos_Aires",
		EDT: "America/New_York",
		CDT: "America/Chicago",
		CST: "America/Mexico_City",
		PDT: "America/Los_Angeles",
		AKDT: "America/Anchorage",
		HDT: "America/Adak",
		HST: "Pacific/Honolulu",
		NUT: "Pacific/Fiji",
		AoE: "Pacific/Wallis",
		UTC: "UTC",
	};

	// Supported languages
	public readonly languages: Record<string, string> = {
		"en-US": "en-US",
	};

	public formatAction(action: string): string {
		switch (action) {
			case "Ban":
				return Emotes.actions.BAN;
			case "Manual Ban":
				return Emotes.actions.BAN;
			case "Force-ban":
				return Emotes.actions.BAN;
			case "Kick":
				return Emotes.actions.KICK;
			case "Manual Kick":
				return Emotes.actions.KICK;
			case "Mute":
				return Emotes.actions.MUTE;
			case "Warn":
				return Emotes.actions.WARN;
			case "Unmute":
				return Emotes.actions.UNBAN;
			case "Unban":
				return Emotes.actions.UNBAN;
			case "Nickname":
				return Emotes.other.EDIT;
		}

		return Emotes.actions.WARN;
	}
}
