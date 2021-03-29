const Command = require("../../structures/Command");
const Discord = require("discord.js");
const Emotes = require("../../emotes.json");

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			description: "Returns the amount of badges in the server",
			category: "Bot",
			usage: "!badges",
			clientPerms: ["EMBED_LINKS"],
		});
	}

	async run(message, _args) {
		let staff = 0;
		let partner = 0;
		let hypesquad_events = 0;
		let hypesquad_bravery = 0;
		let hypesquad_brilliance = 0;
		let hypesquad_balance = 0;
		let bughunter_green = 0;
		let bughunter_gold = 0;
		let earlysupport = 0;
		let botdeveloper = 0;

		message.guild.members.cache.array().forEach(member => {
			const badges = Badge(member.user.flags);
			for (let i = 0; i < badges.length; i++) {
				switch (badges[i]) {
					case "STAFF":
						staff++;
						break;
					case "PARTNERED_SERVER_OWNER":
						partner++;
						break;
					case "HYPESQUAD_EVENTS":
						hypesquad_events++;
						break;
					case "HOUSE_BRAVERY":
						hypesquad_bravery++;
						break;
					case "HOUSE_BRILLIANCE":
						hypesquad_brilliance++;
						break;
					case "HOUSE_BALANCE":
						hypesquad_balance++;
						break;
					case "BUGHUNTER_LEVEL_1":
						bughunter_green++;
						break;
					case "BUGHUNTER_LEVEL_2":
						bughunter_gold++;
						break;
					case "EARLY_VERIFIED_DEVELOPER":
						botdeveloper++;
						break;
					case "EARLY_SUPPORTER":
						earlysupport++;
						break;
					default:
						break;
				}
			}
		});

		const desc = [
			`Badges on **${message.guild.name}** from **${message.guild.memberCount}** members\n`,
			`${Emotes.flags.DISCORD_EMPLOYEE} Discord Staff: **${staff}**`,
			`${Emotes.flags.PARTNERED_SERVER_OWNER} Partner Server Owner: **${partner}**`,
			`${Emotes.flags.HYPESQUAD_EVENTS} HypeSquad Events: **${hypesquad_events}**`,
			`${Emotes.flags.HOUSE_BRAVERY} HypeSquad Bravery: **${hypesquad_bravery}**`,
			`${Emotes.flags.HOUSE_BRILLIANCE} HypeSquad Brilliance: **${hypesquad_brilliance}**`,
			`${Emotes.flags.HOUSE_BALANCE} HypeSquad Balance: **${hypesquad_balance}**`,
			`${Emotes.flags.BUGHUNTER_LEVEL_1} Discord Bug Hunter: **${bughunter_green}**`,
			`${Emotes.flags.BUGHUNTER_LEVEL_2} Discord Bug Hunter Gold: **${bughunter_gold}**`,
			`${Emotes.flags.EARLY_VERIFIED_DEVELOPER} Early Verfied Bot Developer: **${botdeveloper}**`,
			`${Emotes.flags.EARLY_SUPPORTER} Early Supporter: **${earlysupport}**`,
		];

		const embed = new Discord.MessageEmbed()
			.setColor(global.config.embedColor)
			.setDescription(desc.join("\n"))
			.setFooter(
				await this.client.bulbutils.translate("global_executed_by", message.guild.id, {
					user_name: await this.client.bulbutils.userObject(true, message.member).username,
					user_discriminator: await this.client.bulbutils.userObject(true, message.member).discriminator,
				}),
				await this.client.bulbutils.userObject(true, message.member).avatarUrl,
			)
			.setTimestamp();

		return message.channel.send(embed);
	}
};

function Badge(bitfield) {
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

	if ((bitfield & staff) === staff) badges.push("STAFF");
	if ((bitfield & partner) === partner) badges.push("PARTNERED_SERVER_OWNER");
	if ((bitfield & hypesquad_events) === hypesquad_events) badges.push("HYPESQUAD_EVENTS");
	if ((bitfield & hypesquad_bravery) === hypesquad_bravery) badges.push("HOUSE_BRAVERY");
	if ((bitfield & hypesquad_brilliance) === hypesquad_brilliance) badges.push("HOUSE_BRILLIANCE");
	if ((bitfield & hypesquad_balance) === hypesquad_balance) badges.push("HOUSE_BALANCE");
	if ((bitfield & bughunter_green) === bughunter_green) badges.push("BUGHUNTER_LEVEL_1");
	if ((bitfield & bughunter_gold) === bughunter_gold) badges.push("BUGHUNTER_LEVEL_2");
	if ((bitfield & botdeveloper) === botdeveloper) badges.push("EARLY_VERIFIED_DEVELOPER");
	if ((bitfield & earlysupport) === earlysupport) badges.push("EARLY_SUPPORTER");

	return badges;
}
