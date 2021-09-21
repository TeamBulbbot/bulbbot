import Command from "../../structures/Command";
import CommandContext from "../../structures/CommandContext";
import { MessageEmbed, Permissions } from "discord.js";
import { NonDigits } from "../../utils/Regex";
import * as Config from "../../Config";
import BulbBotClient from "../../structures/BulbBotClient";

const bint0 = BigInt(0);
const bint1 = BigInt(1);
const bint2 = BigInt(2);
const PERM_STRINGS = Object.keys(Permissions.FLAGS);
const log10 = (num: number) => num ? Math.log10(num) : 0;
const loglen = ~~log10(PERM_STRINGS.length);

export default class extends Command {
	constructor(client: BulbBotClient, name: string) {
		super(client, {
			name,
            aliases: ["perms"],
			description: "Gets permission names from a permission integer",
			category: "Miscellaneous",
			usage: "<permissions>",
			examples: ["permissions 8", "permissions 12037"],
			argList: ["permissions:integer"],
			minArgs: 1,
			maxArgs: 1,
		});
	}

	async run(context: CommandContext, args: string[]) {
		let permsInt: bigint = BigInt(args[0].replace(NonDigits, ""));

        const permissionStrings: string[] = [];
        for(let i = 0 ; permsInt > bint0; permsInt >>= bint1, ++i)
        {
            const val = permsInt % bint2;
            if(val) permissionStrings.push(`\`1 << ${" ".repeat(loglen - ~~log10(i))}${i}\` - \`${PERM_STRINGS[i]}\``);
        }

		const embed = new MessageEmbed()
			.setColor(Config.embedColor)
			.setDescription(permissionStrings.join('\n'))
			.setFooter(
				await this.client.bulbutils.translate("global_executed_by", context.guild?.id, {
					user: context.author,
				}),
				<string>context.author.avatarURL({ dynamic: true }),
			)
			.setTimestamp();

		return context.channel.send({ embeds: [embed] });
	}
}
