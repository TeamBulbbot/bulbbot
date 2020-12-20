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

		response = response.replace(/({emote_warn})/g, Emotes.actions.warn);
		response = response.replace(/({emote_tools})/g, Emotes.other.tools);
		response = response.replace(/({emote_github})/g, Emotes.other.github);
		response = response.replace(/({emote_owner})/g, Emotes.badges.guildOwner);
		response = response.replace(/({emote_online})/g, Emotes.status.online);
		response = response.replace(/({emote_idle})/g, Emotes.status.idle);
		response = response.replace(/({emote_dnd})/g, Emotes.status.dnd);
		response = response.replace(/({emote_offline})/g, Emotes.status.offline);
		response = response.replace(/({emote_ban})/g, Emotes.actions.ban);
		response = response.replace(/({emote_kick})/g, Emotes.actions.kick);
		response = response.replace(/({emote_unban})/g, Emotes.actions.unban);

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

		if ((bitfield & staff) === staff) badges.push(Emotes.badges.staff);
		if ((bitfield & partner) === partner) badges.push(Emotes.badges.partner);
		if ((bitfield & hypesquad_events) === hypesquad_events) badges.push(Emotes.badges.hypesquad_events);
		if ((bitfield & hypesquad_bravery) === hypesquad_bravery) badges.push(Emotes.badges.hypesquad_bravery);
		if ((bitfield & hypesquad_brilliance) === hypesquad_brilliance) badges.push(Emotes.badges.hypesquad_brilliance);
		if ((bitfield & hypesquad_balance) === hypesquad_balance) badges.push(Emotes.badges.hypesquad_balance);
		if ((bitfield & bughunter_green) === bughunter_green) badges.push(Emotes.badges.bug_hunter_green);
		if ((bitfield & bughunter_gold) === bughunter_gold) badges.push(Emotes.badges.bug_hunter_gold);
		if ((bitfield & botdeveloper) === botdeveloper) badges.push(Emotes.badges.verfied_bot_developer);
		if ((bitfield & earlysupport) === earlysupport) badges.push(Emotes.badges.early_supporter);

		return badges.map(i => `${i}`).join(" ");
	}

	guildFeatures(guildFeatures) {
		let features = [];

		guildFeatures.forEach(feature => {
			if (feature === "INVITE_SPLASH") feature = Emotes.features.invite_splash;
			else if (feature === "VIP_REGIONS") feature = Emotes.features.vip_regions;
			else if (feature === "VANITY_URL") feature = Emotes.features.vanity_url;
			else if (feature === "VERIFIED") feature = Emotes.features.verified;
			else if (feature === "PARTNERED") feature = Emotes.features.partnered;
			else if (feature === "PUBLIC") feature = Emotes.features.public;
			else if (feature === "COMMERCE") feature = Emotes.features.commerce;
			else if (feature === "DISCOVERABLE") feature = Emotes.features.discoverable;
			else if (feature === "FEATURABLE") feature = Emotes.features.featurable;
			else if (feature === "ANIMATED_ICON") feature = Emotes.features.animated_icon;
			else if (feature === "BANNER") feature = Emotes.features.banner;
			else if (feature === "PUBLIC_DISABLED") feature = Emotes.features.public_disabled;
			else if (feature === "WELCOME_SCREEN_ENABLED") feature = Emotes.features.welcome_screen_enabled;
			else if (feature === "NEWS") feature = Emotes.features.news;
			else if (feature === "COMMUNITY") feature = Emotes.features.community;

			features.push(feature);
		});

		return features.map(i => `${i}`).join(" ");
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

	return `${moment.utc(start).format("MMMM, Do YYYY @ hh:mm:ss a")} \`\`(${Math.floor(days).toString().replace("-", "")} days ago)\`\`\n`;
}
