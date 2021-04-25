import Command from "../../structures/Command";
import { Message, MessageEmbed } from "discord.js";
import moment, { Duration } from "moment";
import * as Config from "../../structures/Config"

export default class extends Command {
    constructor(...args: any) {
        // @ts-ignore
        super(...args, {

        });
    }

    async run(message: Message): Promise<void> {
        const time: Duration = moment.duration(this.client.uptime, "milliseconds");
        const days: number = Math.floor(time.asDays());
        const hours: number = Math.floor(time.asHours() - days * 24);
        const mins: number = Math.floor(time.asMinutes() - days * 24 * 60 - hours * 60);
        const secs: number = Math.floor(time.asSeconds() - days * 24 * 60 * 60 - hours * 60 * 60 - mins * 60);

        let uptime: string = "";
        if (days > 0) uptime += `${days} day(s), `;
        if (hours > 0) uptime += `${hours} hour(s), `;
        if (mins > 0) uptime += `${mins} minute(s), `;
        if (secs > 0) uptime += `${secs} second(s)`;

        const embed = new MessageEmbed()
            .setColor(Config.embedColor)
            .setDescription(await this.client.bulbutils.translate("uptime_uptime", message.guild?.id, { uptime }))
            .setFooter(await this.client.bulbutils.translate("global_executed_by", message.guild?.id, {
                    user_name: message.author.username,
                    user_discriminator: message.author.discriminator
                }), <string> message.author.avatarURL()
            )
            .setTimestamp();

        await message.channel.send(embed);
    }
}