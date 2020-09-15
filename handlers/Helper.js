const emotes = require("../emotes.json");

module.exports = {
	Badges: async (bitfield) => {
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

		if ((bitfield & staff) === staff) badges.push(emotes.badges.staff);
		if ((bitfield & partner) === partner) badges.push(emotes.badges.partner);
		if ((bitfield & hypesquad_events) === hypesquad_events) badges.push(emotes.badges.hypesquad_events);
		if ((bitfield & bughunter_green) === bughunter_green) badges.push(emotes.badges.bug_hunter_green);
		if ((bitfield & hypesquad_bravery) === hypesquad_bravery) badges.push(emotes.badges.hypesquad_bravery);
		if ((bitfield & hypesquad_brilliance) === hypesquad_brilliance) badges.push(emotes.badges.hypesquad_brilliance);
		if ((bitfield & hypesquad_balance) === hypesquad_balance) badges.push(emotes.badges.hypesquad_balance);
		if ((bitfield & earlysupport) === earlysupport) badges.push(emotes.badges.eary_supporter);
		if ((bitfield & bughunter_gold) === bughunter_gold) badges.push(emotes.badges.bug_hunter_gold);
		if ((bitfield & botdeveloper) === botdeveloper) badges.push(emotes.badges.verfied_bot_developer);

		return badges.map((i) => `${i}`).join(" ");
	},
};
