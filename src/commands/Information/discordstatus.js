const Discord = require("discord.js");
const Command = require("../../structures/Command");
const axios = require("axios");

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			description: "Gets the latest information about Discord status",
			category: "Information",
			aliases: ["dstatus"],
			usage: "!discordstatus",
		});
	}

	async run(message, args) {
		const url = "https://discordstatus.com/api/v2/incidents.json";
		const ping = Math.round(this.client.ws.ping);
		const client = this.client;

		axios.get(url).then(async function (res) {
			const incident = res.data.incidents[0];
			let msg = "";

			msg += `**Incident: **${incident.name} \`(${incident.id})\`\n`;
			msg += `**Status: ** ${incident.status}\n`;
			msg += `**URL: ** [Link](${incident.shortlink})\n`;
			msg += `**Started: ** ${incident.created_at}\n`;
			msg += `**Latest Update: ** ${incident.updated_at}\n`;

			const inciUpdates = incident.incident_updates[0];
			if (inciUpdates !== null) {
				msg += "\n\n**Updates**\n";
				msg += `**Status Update: ** ${inciUpdates.status}\n`;
				msg += `**Information:** ${inciUpdates.body}\n`;
				msg += `**Date:** ${inciUpdates.created_at}\n`;
			}

			const embed = new Discord.MessageEmbed()
				.setColor(global.config.embedColor)
				.setTitle("Discord Status Updates")
				.setDescription(`**API Latency:** ${ping} ms\n\n**Latest incident**\n${msg}`)
				.setFooter(
					client.bulbutils.translate("global_executed_by", {
						user_name: await client.bulbutils.userObject(true, message.member).username,
						user_discriminator: await client.bulbutils.userObject(true, message.member).discriminator,
					}),
					await client.bulbutils.userObject(true, message.member).avatarUrl,
				)
				.setTimestamp();

			return message.channel.send(embed);
		});
	}
};
