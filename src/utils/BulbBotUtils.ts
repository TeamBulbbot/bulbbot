import { GuildChannel, GuildMember, Message, MessageEmbed, Snowflake, User } from "discord.js";
import * as enUS from "../languages/en-US.json";
import * as Emotes from "../emotes.json";
import moment, { Duration, Moment } from "moment";
import MessageFormat from "@messageformat/core";
import BulbBotClient from "../structures/BulbBotClient";
import { UserHandle } from "./types/UserHandle";

export default class {
	private readonly client: BulbBotClient;

	constructor(client: BulbBotClient) {
		this.client = client;
	}

	public async translate(string: string, guildID: Snowflake = "742094927403679816", key: any = {}): Promise<string> {
		let response: string = JSON.parse(JSON.stringify(enUS))[string].toString();

		response = response.replace(/({latency_bot})/g, key.latency_bot);
		response = response.replace(/({latency_ws})/g, key.latency_ws);

		response = response.replace(/({uptime})/g, key.uptime);
		response = response.replace(/({timestamp})/g, key.timestamp);
		response = response.replace(/({zone})/g, key.zone);
		response = response.replace(/({until})/g, key.until);

		response = response.replace(/({nick_old})/g, key.nick_old);
		response = response.replace(/({nick_new})/g, key.nick_new);
		response = response.replace(/({role})/g, key.role);

		response = response.replace(/({missing})/g, key.missing);

		response = response.replace(/({user_id})/g, key.user_id);
		response = response.replace(/({user_name})/g, key.user_name);
		response = response.replace(/({user_nickname})/g, key.user_nickname);
		response = response.replace(/({user_discriminator})/g, key.user_discriminator);
		response = response.replace(/({user_avatar})/g, key.user_avatar);
		response = response.replace(/({user_bot})/g, key.user_bot);
		response = response.replace(/({user_age})/g, `<t:${Math.floor(key.user_age / 1000)}:F> (<t:${Math.floor(key.user_age / 1000)}:R>)`);
		response = response.replace(/({user_premium})/g, `<t:${Math.floor(key.user_premium / 1000)}:F> (<t:${Math.floor(key.user_premium / 1000)}:R>)`);
		response = response.replace(/({user_joined})/g, `<t:${Math.floor(key.user_joined / 1000)}:F> (<t:${Math.floor(key.user_joined / 1000)}:R>)`);
		response = response.replace(/({user_roles})/g, key.user_roles);
		response = response.replace(/({user_infractions})/g, key.user_infractions);
		if (key.user_infractions !== undefined) {
			if (key.user_infractions <= 1) response = response.replace(/({emote_inf})/g, Emotes.status.ONLINE);
			if (key.user_infractions === 2) response = response.replace(/({emote_inf})/g, Emotes.other.INF1);
			if (key.user_infractions > 2) response = response.replace(/({emote_inf})/g, Emotes.other.INF2);
		}

		response = response.replace(/({moderator_id})/g, key.moderator_id);
		response = response.replace(/({moderator_tag})/g, key.moderator_tag);
		response = response.replace(/({target_id})/g, key.target_id);
		response = response.replace(/({target_tag})/g, key.target_tag);
		response = response.replace(/({action})/g, key.action);
		response = response.replace(/({emoji})/g, key.emoji);

		response = response.replace(/({part})/g, key.part);
		response = response.replace(/({prefix})/g, key.prefix);
		response = response.replace(/({language})/g, key.language);
		response = response.replace(/({languages})/g, key.languages);
		response = response.replace(/({clearance})/g, key.clearance);
		response = response.replace(/({command})/g, key.command);
		response = response.replace(/({message})/g, key.message);
		response = response.replace(/({words})/g, key.words);

		response = response.replace(/({infractionId})/g, key.infractionId);

		if (key.guild) {
			response = response.replace(/({guild_owner_name})/g, key.guild.ownerID);
			response = response.replace(/({guild_owner_id})/g, key.guild.owner.id);
			response = response.replace(/({guild_features})/g, this.guildFeatures(key.guild.features));
			response = response.replace(/({guild_region})/g, this.guildRegion(key.guild.region));
			response = response.replace(/({guild_verification})/g, key.guild.verificationLevel);
			response = response.replace(/({guild_age})/g, `<t:${Math.floor(key.guild.createdTimestamp / 1000)}:F> (<t:${Math.floor(key.guild.createdTimestamp / 1000)}:R>)`);
			response = response.replace(/({guild_members})/g, key.guild.memberCount);

			response = response.replace(/({guild_max})/g, key.guild.maximumMembers);
			response = response.replace(/({guild_online})/g, key.guild.members.cache.filter((m: GuildMember) => m.presence.status === "online").size);
			response = response.replace(/({guild_idle})/g, key.guild.members.cache.filter((m: GuildMember) => m.presence.status === "idle").size);
			response = response.replace(/({guild_dnd})/g, key.guild.members.cache.filter((m: GuildMember) => m.presence.status === "dnd").size);
			response = response.replace(
				/({guild_offline})/g,
				// @ts-ignore
				key.guild.memberCount -
					key.guild.members.cache.filter(m => m.presence.status === "dnd").size -
					key.guild.members.cache.filter(m => m.presence.status === "idle").size -
					key.guild.members.cache.filter(m => m.presence.status === "online").size,
			);

			response = response.replace(/({guild_voice})/g, key.guild.channels.cache.filter((ch: GuildChannel) => ch.type === "voice").size);
			response = response.replace(/({guild_text})/g, key.guild.channels.cache.filter((ch: GuildChannel) => ch.type === "category").size);
			response = response.replace(/({guild_category})/g, key.guild.channels.cache.filter((ch: GuildChannel) => ch.type === "text").size);

			response = response.replace(/({guild_booster_tier})/g, key.guild.premiumTier);
			response = response.replace(/({guild_booster_boosters})/g, key.guild.premiumSubscriptionCount);
		}

		if (key.channel) response = response.replace(/({channel})/g, key.channel);

		response = response.replace(/({user_tag})/g, key.user_tag);

		response = response.replace(/({amount})/g, key.amount);
		response = response.replace(/({changes})/g, key.changes);
		response = response.replace(/({limit})/g, key.limit);
		response = response.replace(/({before})/g, key.before);
		response = response.replace(/({after})/g, key.after);
		response = response.replace(/({after_channel_id})/g, key.after_channel_id);
		response = response.replace(/({after_id})/g, key.after_id);

		response = response.replace(/({content})/g, key.content);
		response = response.replace(/({attachment})/g, key.attachment);
		response = response.replace(/({embed})/g, key.embed);

		response = response.replace(/({channel_id})/g, key.channel_id);
		response = response.replace(/({channel_type})/g, key.channel_type);
		response = response.replace(/({channel_name})/g, key.channel_name);
		response = response.replace(/({channel_topic})/g, key.channel_topic);
		response = response.replace(/({oldchannel_topic})/g, key.oldchannel_topic);
		response = response.replace(/({newchannel_topic})/g, key.newchannel_topic);
		response = response.replace(/({oldchannel_name})/g, key.oldchannel_name);
		response = response.replace(/({newchannel_name})/g, key.newchannel_name);
		response = response.replace(/({oldchannel_type})/g, key.oldchannel_type);
		response = response.replace(/({newchannel_type})/g, key.newchannel_type);

		response = response.replace(/({slowmode})/g, key.slowmode);

		response = response.replace(/({guild_amount_roles})/g, key.guild_amount_roles);
		response = response.replace(/({guild_amount_emotes})/g, key.guild_amount_emotes);
		response = response.replace(/({guild_roles_left})/g, key.guild_roles_left);
		response = response.replace(/({guild_emotes_left})/g, key.guild_emotes_left);

		response = response.replace(/({arg})/g, key.arg);
		response = response.replace(/({arg_expected})/g, key.arg_expected);
		response = response.replace(/({arg_provided})/g, key.arg_provided);
		response = response.replace(/({usage})/g, key.usage);
		response = response.replace(/({command})/g, key.command);

		response = response.replace(/({reason})/g, key.reason);

		response = response.replace(/({snowflake})/g, key.snowflake);

		response = response.replace(/({level})/g, key.level);
		response = response.replace(/({count})/g, key.count);

		response = response.replace(/({item})/g, key.item);
		response = response.replace(/({part})/g, key.part);
		response = response.replace(/({punishment})/g, key.punishment);
		response = response.replace(/({limit})/g, key.limit);

		response = response.replace(/({bot_invite})/g, key.bot_invite);
		response = response.replace(/({support_guild})/g, key.support_guild);

		response = response.replace(/({emote_warn})/g, Emotes.actions.WARN);
		response = response.replace(/({emote_lock})/g, Emotes.other.LOCK);
		response = response.replace(/({emote_fail})/g, Emotes.other.FAIL);
		response = response.replace(/({emote_wrench})/g, Emotes.actions.WRENCH);
		response = response.replace(/({emote_github})/g, Emotes.other.GITHUB);
		response = response.replace(/({emote_owner})/g, Emotes.other.GUILD_OWNER);
		response = response.replace(/({emote_online})/g, Emotes.status.ONLINE);
		response = response.replace(/({emote_idle})/g, Emotes.status.IDLE);
		response = response.replace(/({emote_dnd})/g, Emotes.status.DND);
		response = response.replace(/({emote_offline})/g, Emotes.status.OFFLINE);
		response = response.replace(/({emote_loading})/g, Emotes.other.LOADING);
		response = response.replace(/({emote_join})/g, Emotes.other.JOIN);
		response = response.replace(/({emote_leave})/g, Emotes.other.LEAVE);
		response = response.replace(/({emote_success})/g, Emotes.other.SUCCESS);
		response = response.replace(/({emote_trash})/g, Emotes.other.TRASH);
		response = response.replace(/({emote_edit})/g, Emotes.other.EDIT);

		response = response.replace(/({emote_ban})/g, Emotes.actions.BAN);
		response = response.replace(/({emote_unban})/g, Emotes.actions.UNBAN);
		response = response.replace(/({emote_kick})/g, Emotes.actions.KICK);
		response = response.replace(/({emote_mute})/g, Emotes.actions.MUTE);

		response = response.replace(/({full_list})/g, key.full_list);

		if (key.user_infractions !== undefined) {
			const mf = new MessageFormat("en");
			const output = mf.compile(response);

			response = <string>output({ infractions: key.user_infractions });
		}

		return response;
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

	private guildFeatures(guildFeatures) {
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

	private guildRegion(region: string) {
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

	public async embedPage(message, pages: MessageEmbed[], emojiList: string[] = ["⏪", "⏩"], timeout: number = 120000) {
		if (!message && !message.channel) throw new Error("Channel is inaccessible.");
		if (!pages) throw new Error("Pages are not given.");
		if (emojiList.length !== 2) throw new Error("Need two emojis.");
		let page = 0;
		const curPage = await message.channel.send(pages[page].setFooter(`Page ${page + 1} / ${pages.length}`));
		for (const emoji of emojiList) {
			await curPage.react(emoji);
			await this.client.bulbutils.sleep(250);
		}
		const reactionCollector = curPage.createReactionCollector((reaction, user) => user.id === message.author.id, { time: timeout });
		reactionCollector.on("collect", reaction => {
			reaction.users.remove(message.author);
			switch (reaction.emoji.id) {
				case emojiList[0].replace(/\D/g, ""):
					page = page > 0 ? --page : pages.length - 1;
					break;
				case emojiList[1].replace(/\D/g, ""):
					page = page + 1 < pages.length ? ++page : 0;
					break;
				default:
					break;
			}
			curPage.edit(pages[page].setFooter(`Page ${page + 1} / ${pages.length}`));
		});
		reactionCollector.on("end", () => {
			if (!curPage.deleted) {
				curPage.reactions.removeAll();
			}
		});
		return curPage;
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

	formatSmall(start: number) {
		const string = moment(new Date(start)).fromNow();
		return string.charAt(0).toUpperCase() + string.slice(1);
	}

	prettify(action: string): string {
		let finalString = "";
		switch (action) {
			case "Ban":
				finalString = `${Emotes.actions.BAN} Ban`;
				break;
			case "Forceban":
				finalString = `${Emotes.actions.BAN} Forceban`;
				break;
			case "Kick":
				finalString = `${Emotes.actions.KICK} Kick`;
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
		}

		return finalString;
	}

	checkUser(message: Message, user: GuildMember): UserHandle {
		if (user.id === message.author.id) return UserHandle.CANNOT_ACTION_SELF;

		if (message.guild?.owner?.id === user.id) return UserHandle.CANNOT_ACTION_OWNER;

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
				await message.channel.send(await this.translate("global_cannot_action_role_equal", message.guild?.id, { user_tag: user.tag }));
				return true;

			case UserHandle.CANNOT_ACTION_BOT_SELF:
				await message.channel.send(await this.translate("global_cannot_action_bot_self", message.guild?.id, {}));
				return true;

			case UserHandle.CANNOT_ACTION_ROLE_HIGHER:
				await message.channel.send(await this.translate("global_cannot_action_role_higher", message.guild?.id, { user_tag: user.tag }));
				return true;

			case UserHandle.CANNOT_ACTION_USER_ROLE_EQUAL_BOT:
				await message.channel.send(await this.translate("global_cannot_action_role_equal_bot", message.guild?.id, { user_tag: user.tag }));
				return true;

			case UserHandle.CANNOT_ACTION_USER_ROLE_HIGHER_BOT:
				await message.channel.send(await this.translate("global_cannot_action_role_higher_bot", message.guild?.id, { user_tag: user.tag }));
				return true;

			case UserHandle.SUCCESS:
				return false;

			default:
				return false;
		}
	}

	public readonly timezones: object = {
		ANAT: "Asia/Anadyr",
		AEDT: "Australia/Melbourne",
		AEST: "Australia/Brisbane",
		JST: "Asia/Tokyo",
		AWST: "Asia/Shanghai",
		WIB: "Asia/Jakarta",
		BTT: "Asia/Dhaka",
		UZT: "Asia/Tashkent",
		GST: "Asia/Dubai",
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
}
