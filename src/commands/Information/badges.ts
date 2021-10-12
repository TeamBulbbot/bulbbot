import Command from "../../structures/Command";
import CommandContext from "../../structures/CommandContext";
import { Message, MessageEmbed } from "discord.js";
import { embedColor } from "../../Config";
import * as Emotes from "../../emotes.json";
import BulbBotClient from "../../structures/BulbBotClient";

export default class extends Command {
	constructor(client: BulbBotClient, name: string) {
		super(client, {
			name,
			description: "Returns the amount of badges in the server",
			category: "Bot",
			clientPerms: ["EMBED_LINKS"],
			devOnly: true,
		});
	}

	public async run(context: CommandContext, _: string[]): Promise<void | Message> {
		// await context.guild?.fetch();
		// context.guild?.members.fetch();

		let staff = 0;
		let partner = 0;
		let certifiedMod = 0;
		let hypesquad_events = 0;
		let hypesquad_bravery = 0;
		let hypesquad_brilliance = 0;
		let hypesquad_balance = 0;
		let bughunter_green = 0;
		let bughunter_gold = 0;
		let earlysupport = 0;
		let botdeveloper = 0;

		context.guild?.members.cache.forEach(member => {
			const badges = this.badge(<number>member.user.flags?.bitfield);
			for (let i = 0; i < badges.length; i++) {
				switch (badges[i]) {
					case "STAFF":
						staff++;
						break;
					case "CERTIFIED_MODERATOR":
						certifiedMod++;
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
			`Badges in **${context.guild?.name}** from **${context.guild?.memberCount}** members\n`,
			`${Emotes.flags.DISCORD_EMPLOYEE} Discord Staff: **${staff}**`,
			`${Emotes.flags.PARTNERED_SERVER_OWNER} Partnered Server Owner: **${partner}**`,
			`${Emotes.flags.CERTIFIED_MODERATOR} Discord Certified Moderator: **${certifiedMod}**`,
			`${Emotes.flags.HYPESQUAD_EVENTS} HypeSquad Events: **${hypesquad_events}**`,
			`${Emotes.flags.HOUSE_BRAVERY} HypeSquad Bravery: **${hypesquad_bravery}**`,
			`${Emotes.flags.HOUSE_BRILLIANCE} HypeSquad Brilliance: **${hypesquad_brilliance}**`,
			`${Emotes.flags.HOUSE_BALANCE} HypeSquad Balance: **${hypesquad_balance}**`,
			`${Emotes.flags.BUGHUNTER_LEVEL_1} Discord Bug Hunter: **${bughunter_green}**`,
			`${Emotes.flags.BUGHUNTER_LEVEL_2} Discord Bug Hunter Gold: **${bughunter_gold}**`,
			`${Emotes.flags.EARLY_VERIFIED_DEVELOPER} Early Verfied Bot Developer: **${botdeveloper}**`,
			`${Emotes.flags.EARLY_SUPPORTER} Early Supporter: **${earlysupport}**`,
		];

		const embed: MessageEmbed = new MessageEmbed()
			.setColor(embedColor)
			.setDescription(desc.join("\n"))
			.setFooter(
				await this.client.bulbutils.translate("global_executed_by", context.guild?.id, {
					user: context.author,
				}),
				<string>context.author.avatarURL({ dynamic: true }),
			)
			.setTimestamp();

		return context.channel.send({ embeds: [embed] });
	}

	private badge(bitfield: number) {
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

		if ((bitfield & staff) === staff) badges.push("STAFF");
		if ((bitfield & partner) === partner) badges.push("PARTNERED_SERVER_OWNER");
		if ((bitfield & certifiedMod) === certifiedMod) badges.push("CERTIFIED_MODERATOR");
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
}
