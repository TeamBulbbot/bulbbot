const Command = require("../../structures/Command");
const Discord = require("discord.js");

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			devOnly: true,
		});
	}

	async run(message, args) {
	    let description = ""
        description += "**Infraction ID:** 2021\n"
        description += "**Target:** KlukCZ589 `(439396770695479297)`\n"
        description += "**Moderator:** KlukCZ589 `(439396770695479297)`\n"
        description += "**Created:** Dec 30th 2020, 6:54:00 pm\n"
        description += "**Active:** <:INF2:791310258249007164> False\n"
        description += "**Expires:** Expired\n\n"
        description += "**Reason:** bad boyo (https://cdn.klukcz.me/img/wEqQDpry.png)\n"

		const embed = new Discord.MessageEmbed()
            .setTitle("<:bulbBAN:793193105523736576> Tempban")
		    .setDescription(description)
            .setColor(process.env.EMBED_COLOR)
            .setThumbnail("https://cdn.discordapp.com/avatars/439396770695479297/8b6bc6c5883068ad800f123ce0d1b445.webp?size=4096")
            .setImage("https://cdn.klukcz.me/img/wEqQDpry.png")
            .setFooter("Executed by: KlukCZ#6589", "https://cdn.discordapp.com/avatars/439396770695479297/8b6bc6c5883068ad800f123ce0d1b445.webp?size=4096")
            .setTimestamp()

        message.channel.send(embed)
	}
};
