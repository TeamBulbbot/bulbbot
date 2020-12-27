const lang = require("./../languages/en-US.json");
const { TranslatorException } = require("./../structures/exceptions/TranslatorException");
const Emotes = require("./../Emotes.json");
const moment = require("moment");

module.exports = class BulbBotUtils {
	constructor(client) {
		this.client = client;
	}

	/**
	 *
	 * @param string    Translatable string from the lang file
	 * @param key       Values that should be replaced by the function
	 * @returns {*}     Resolved translated string
	 */
	translate(string, key = {}) {
		let response;
		try {
			response = JSON.parse(JSON.stringify(lang))[string].toString();
		} catch (err) {
			throw new TranslatorException(`${string} is not a valid translatable string`);
		}

		response = response.replace(/({latency_bot})/g, key.latency_bot);
		response = response.replace(/({latency_ws})/g, key.latency_ws);

		response = response.replace(/({uptime})/g, key.uptime);
		response = response.replace(/({timestamp})/g, key.timestamp);
		response = response.replace(/({until})/g, key.until);

		response = response.replace(/({user_id})/g, key.user_id);
		response = response.replace(/({user_name})/g, key.user_name);
		response = response.replace(/({user_nickname})/g, key.user_nickname);
		response = response.replace(/({user_discriminator})/g, key.user_discriminator);
		response = response.replace(/({user_avatar})/g, key.user_avatar);
		response = response.replace(/({user_bot})/g, key.user_bot);
		response = response.replace(/({user_age})/g, formatDays(key.user_age));
		response = response.replace(/({user_premium})/g, formatDays(key.user_premium));
		response = response.replace(/({user_joined})/g, formatDays(key.user_joined));
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

		response = response.replace(/({infractionId})/g, key.infractionId);

		if (key.guild) {
			response = response.replace(/({guild_owner_name})/g, key.guild.ownerID);
			response = response.replace(/({guild_owner_id})/g, key.guild.owner.id);
			response = response.replace(/({guild_features})/g, this.guildFeatures(key.guild.features));
			response = response.replace(/({guild_region})/g, this.guildRegion(key.guild.region));
			response = response.replace(/({guild_verification})/g, key.guild.verificationLevel);
			response = response.replace(/({guild_age})/g, formatDays(key.guild.createdTimestamp));
			response = response.replace(/({guild_members})/g, key.guild.memberCount);

			response = response.replace(/({guild_max})/g, key.guild.maximumMembers);
			response = response.replace(/({guild_online})/g, key.guild.members.cache.filter(m => m.presence.status === "online").size);
			response = response.replace(/({guild_idle})/g, key.guild.members.cache.filter(m => m.presence.status === "idle").size);
			response = response.replace(/({guild_dnd})/g, key.guild.members.cache.filter(m => m.presence.status === "dnd").size);
			response = response.replace(
				/({guild_offline})/g,
				key.guild.memberCount -
					key.guild.members.cache.filter(m => m.presence.status === "dnd").size -
					key.guild.members.cache.filter(m => m.presence.status === "idle").size -
					key.guild.members.cache.filter(m => m.presence.status === "online").size,
			);

			response = response.replace(/({guild_voice})/g, key.guild.channels.cache.filter(m => m.type === "voice").size);
			response = response.replace(/({guild_text})/g, key.guild.channels.cache.filter(m => m.type === "category").size);
			response = response.replace(/({guild_category})/g, key.guild.channels.cache.filter(m => m.type === "text").size);

			response = response.replace(/({guild_booster_tier})/g, key.guild.premiumTier);
			response = response.replace(/({guild_booster_boosters})/g, key.guild.premiumSubscriptionCount);
		}

		if (key.channel) {
			response = response.replace(/({channel})/g, key.channel);
		}

		response = response.replace(/({slowmode})/g, key.slowmode);

		response = response.replace(/({guild_amount_roles})/g, key.guild_amount_roles);
		response = response.replace(/({guild_amount_emotes})/g, key.guild_amount_emotes);
		response = response.replace(/({guild_roles_left})/g, key.guild_roles_left);
		response = response.replace(/({guild_emotes_left})/g, key.guild_emotes_left);

		response = response.replace(/({arg})/g, key.arg);
		response = response.replace(/({arg_expected})/g, key.arg_expected);
		response = response.replace(/({arg_provided})/g, key.arg_provided);
		response = response.replace(/({usage})/g, key.usage);

		response = response.replace(/({reason})/g, key.reason);

		response = response.replace(/({snowflake})/g, key.snowflake);

		response = response.replace(/({level})/g, key.level);

		response = response.replace(/({bot_invite})/g, key.bot_invite);
		response = response.replace(/({support_guild})/g, key.support_guild);

		response = response.replace(/({emote_warn})/g, Emotes.actions.WARN);
		response = response.replace(/({emote_confirm})/g, Emotes.actions.CONFIRM);
		response = response.replace(/({emote_tools})/g, Emotes.other.tools);
		response = response.replace(/({emote_github})/g, Emotes.other.github);
		response = response.replace(/({emote_owner})/g, Emotes.other.GUILD_OWNER);
		response = response.replace(/({emote_online})/g, Emotes.status.ONLINE);
		response = response.replace(/({emote_idle})/g, Emotes.status.IDLE);
		response = response.replace(/({emote_dnd})/g, Emotes.status.DND);
		response = response.replace(/({emote_offline})/g, Emotes.status.OFFLINE);

		response = response.replace(/({emote_ban})/g, Emotes.actions.ban);
		response = response.replace(/({emote_kick})/g, Emotes.actions.kick);
		response = response.replace(/({emote_unban})/g, Emotes.actions.unban);

		response = response.replace(/({full_list})/g, key.full_list);

		return response;
	}

	/**
	 * Formats the bitfield returned by the {@link User} object into an array of badge emojis
	 *
	 * @param bitfield		Bitfield provided by the {@link User} object
	 * @returns {string}	Returned array of badges
	 */
	badges(bitfield) {
		let badges = [];

		const staff = 1 << 0;
		const partner = 1 << 1;
		const hypesquad_events = 1 << 2;
		const bughunter_green = 1 << 3;
		const hypesquad_bravery = 1 << 6;
		const hypesquad_brilliance = 1 << 7;
		const hypesquad_balance = 1 << 8;
		const earlysupport = 1 << 9;
		const bughunter_gold = 1 << 14;
		const botdeveloper = 1 << 17;

		if ((bitfield & staff) === staff) badges.push(Emotes.flags.DISCORD_EMPLOYEE);
		if ((bitfield & partner) === partner) badges.push(Emotes.flags.PARTNERED_SERVER_OWNER);
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

	guildFeatures(guildFeatures) {
		let features = [];

		guildFeatures.forEach(feature => {
			let f;
			let desc;

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
				desc = "Shard the guild connections to different nodes that relay information between each other.";
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
				desc = "Shard the guild connections to different nodes that relay information between each other.";
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
			}

			if (features.length <= 10) f += `[\`${feature}\`](https://bulbbot.mrphilip.xyz '${desc}')`;
			else f += `\`${feature}\``;

			features.push(f);
		});

		features.sort();

		return features.map(i => `${i}`).join("\n");
	}

	guildRegion(region) {
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

	/**
	 * Creates a global user object
	 *
	 * @param isGuildMember         Is a guild member object
	 * @param userObject            The user object
	 * @returns {UserObject}
	 */
	userObject(isGuildMember, userObject) {
		let user;

		if (isGuildMember) {
			user = {
				id: userObject.user.id,
				flags: userObject.user.flags,
				username: userObject.user.username,
				discriminator: userObject.user.discriminator,
				avatar: userObject.user.avatar,
				avatarUrl: userObject.user.avatarURL({ dynamic: true }),
				bot: userObject.user.bot,

				roles: userObject.roles,
				nickname: userObject.nickname,
				premiumSinceTimestamp: userObject.premiumSinceTimestamp,
				joinedTimestamp: userObject.joinedTimestamp,
				createdAt: userObject.user.createdAt,
			};
		} else {
			user = {
				id: userObject.id,
				flags: userObject.flags,
				username: userObject.username,
				discriminator: userObject.discriminator,
				avatar: userObject.avatar,
				avatarUrl: userObject.avatarURL({ dynamic: true }),
				bot: userObject.bot,
				createdAt: userObject.createdAt,
			};
		}

		return user;
	}
};

function formatDays(start) {
	const end = moment.utc().format("YYYY-MM-DD");
	const date = moment(moment.utc(start).format("YYYY-MM-DD"));
	const days = moment.duration(date.diff(end)).asDays();

	return `${moment.utc(start).format("MMMM, Do YYYY @ hh:mm:ss a")} \`\`(${Math.floor(days).toString().replace("-", "")} days ago)\`\``;
}
