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

		response = response.replace(/({arg})/g, key.arg);
		response = response.replace(/({arg_expected})/g, key.arg_expected);
		response = response.replace(/({arg_provided})/g, key.arg_provided);
		response = response.replace(/({usage})/g, key.usage);

		response = response.replace(/({emote_warn})/g, Emotes.actions.warn);
		response = response.replace(/({emote_tools})/g, Emotes.other.tools);
		response = response.replace(/({emote_github})/g, Emotes.other.github);
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
		if ((bitfield & earlysupport) === earlysupport) badges.push(Emotes.badges.eary_supporter);

		return badges.map(i => `${i}`).join(" ");
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